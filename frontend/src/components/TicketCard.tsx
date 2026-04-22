import { Link } from 'react-router-dom';
import { Ticket } from '../types/Ticket';
import { formatDate, timeAgo } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange?: (id: number, status: string) => void;
}

export default function TicketCard({ ticket, onStatusChange }: TicketCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Link to={`/tickets/${ticket.id}`}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg hover:text-blue-600">{ticket.title}</h3>
          <StatusBadge status={ticket.status} />
        </div>
      </Link>
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{ticket.description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded ${
          ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
          ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {ticket.priority}
        </span>
        {ticket.category && (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {ticket.category}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{ticket.userName}</span>
        <span>{timeAgo(ticket.createdAt)}</span>
      </div>
    </div>
  );
}