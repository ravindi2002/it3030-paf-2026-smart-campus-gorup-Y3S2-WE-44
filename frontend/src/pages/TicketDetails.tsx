import { useState, useEffect, useParams } from 'react';
import { ticketService } from '../services/ticketService';
import { commentService } from '../services/commentService';
import { Ticket, Comment } from '../types/Ticket';
import StatusBadge from '../components/StatusBadge';
import CommentSection from '../components/CommentSection';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        ticketService.getById(parseInt(id)),
        commentService.getByTicketId(parseInt(id)),
      ]).then(([t, c]) => {
        setTicket(t);
        setComments(c);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleCommentAdded = async () => {
    if (id) {
      const updated = await commentService.getByTicketId(parseInt(id));
      setComments(updated);
    }
  };

  if (loading || !ticket) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <StatusBadge status={ticket.status} />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-sm ${
            ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
            ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {ticket.priority}
          </span>
          {ticket.category && <span className="bg-gray-100 px-2 py-1 rounded text-sm">{ticket.category}</span>}
          {ticket.location && <span className="bg-gray-100 px-2 py-1 rounded text-sm">{ticket.location}</span>}
        </div>
        <p className="text-gray-700 mb-4">{ticket.description}</p>
        {ticket.imageUrl && <img src={ticket.imageUrl} alt="Issue" className="w-full max-h-96 object-contain rounded mb-4" />}
        <div className="text-sm text-gray-500 mb-6">
          <p>Reported by: {ticket.userName}</p>
          <p>Created: {formatDate(ticket.createdAt)}</p>
          {ticket.assignedToName && <p>Assigned to: {ticket.assignedToName}</p>}
        </div>
        {isAuthenticated() && (
          <CommentSection ticketId={ticket.id!} comments={comments} currentUserId={(user as any)?.id || 1} onCommentAdded={handleCommentAdded} />
        )}
      </div>
    </div>
  );
}