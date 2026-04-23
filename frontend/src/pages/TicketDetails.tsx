import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useEffect, useState } from 'react';

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (id) api.get(`/tickets/${id}`).then(res => setTicket(res.data));
  }, [id]);

  if (!ticket) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
        <p className="text-gray-700 mb-4">{ticket.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-sm ${
            ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
            ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>{ticket.priority}</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{ticket.status}</span>
        </div>
        <p className="text-sm text-gray-500">Reported by: {ticket.userName}</p>
      </div>
    </div>
  );
}