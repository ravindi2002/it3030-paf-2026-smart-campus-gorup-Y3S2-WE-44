import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('smartcampus_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
      setComments(response.data.comments || []);
    } catch (err: any) {
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !user?.id) return;
    try {
      await api.post(`/tickets/${id}/comments`, {
        content: newComment,
        ticketId: parseInt(id!)
      }, { params: { userId: user.id } });
      setNewComment('');
      fetchTicket();
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  const downloadQR = () => {
    window.open(`http://localhost:8081/api/tickets/${id}/qr`, '_blank');
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print QR - Ticket #${id}</title></head>
          <body style="text-align:center;padding:40px;font-family:sans-serif;">
            <h2>🎫 Ticket QR Code</h2>
            <p>Scan to view ticket details</p>
            <img src="http://localhost:8081/api/tickets/${id}/qr" style="width:250px;height:250px;" />
            <h3>Ticket #${id}</h3>
            <p>${ticket?.title}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '🔴';
      case 'IN_PROGRESS': return '🟡';
      case 'RESOLVED': return '🟢';
      case 'CLOSED': return '⚫';
      case 'REJECTED': return '❌';
      default: return '⚪';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800 border-red-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  
  if (!ticket) {
    return <div className="p-6">Ticket not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/tickets" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Tickets
      </Link>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          <p className="text-gray-500">Ticket #{ticket.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getStatusColor(ticket.status)}</span>
          <span className={`px-3 py-1 rounded-full font-medium border ${getStatusBg(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">🔳 QR Code</h3>
            <p className="text-sm text-blue-700">Scan to access ticket instantly</p>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadQR} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
              📥 Download
            </button>
            <button onClick={() => setShowQR(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
              📱 View QR
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">📋 Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium">{ticket.category || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Priority:</span>
              <span className={`font-medium ${
                ticket.priority === 'HIGH' ? 'text-red-600' :
                ticket.priority === 'MEDIUM' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {ticket.priority === 'HIGH' ? '🔴' : ticket.priority === 'MEDIUM' ? '🟡' : '🟢'} {ticket.priority}
              </span>
            </div>
            {ticket.location && (
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium">{ticket.location}</span>
              </div>
            )}
            {ticket.preferredContact && (
              <div className="flex justify-between">
                <span className="text-gray-500">Contact:</span>
                <span className="font-medium">{ticket.preferredContact}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">👤 Assignment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Reporter:</span>
              <span className="font-medium">{ticket.userName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Assigned To:</span>
              <span className="font-medium">{ticket.assignedToName || 'Not assigned'}</span>
            </div>
            {ticket.createdAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">📝 Description</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {ticket.resolutionNotes && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">✓ Resolution</h3>
          <p className="text-green-800">{ticket.resolutionNotes}</p>
        </div>
      )}

      {ticket.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-900 mb-2">❌ Rejection Reason</h3>
          <p className="text-red-800">{ticket.rejectionReason}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">💬 Comments ({comments.length})</h3>
        
        <div className="space-y-3 mb-4">
          {comments.length > 0 ? (
            comments.map((comment: any, index: number) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet</p>
          )}
        </div>

        {ticket.status !== 'CLOSED' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addComment()}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              Send
            </button>
          </div>
        )}
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">🔳 Ticket QR Code</h3>
              <img 
                src={`http://localhost:8081/api/tickets/${id}/qr`} 
                alt="QR Code"
                className="mx-auto border-2 border-gray-200 rounded-lg"
                style={{ width: '200px', height: '200px' }}
              />
              <p className="text-sm text-gray-600 mt-4">Scan to view ticket details</p>
              <div className="flex justify-center gap-2 mt-4">
                <button onClick={downloadQR} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Download
                </button>
                <button onClick={printQR} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Print
                </button>
              </div>
              <button onClick={() => setShowQR(false)} className="mt-4 text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}