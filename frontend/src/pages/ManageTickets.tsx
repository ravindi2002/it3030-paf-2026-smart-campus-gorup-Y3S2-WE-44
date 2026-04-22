import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { Ticket, TicketStatus } from '../types/Ticket';
import TicketCard from '../components/TicketCard';

export default function ManageTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const params = filter !== 'ALL' ? { status: filter } : {};
    ticketService.getAll(params).then(setTickets).finally(() => setLoading(false));
  }, [filter]);

  const handleStatusChange = async (id: number, status: TicketStatus) => {
    await ticketService.updateStatus(id, status);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tickets</h1>
      <div className="flex gap-2 mb-6">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map(ticket => (
            <div key={ticket.id}>
              <TicketCard ticket={ticket} />
              {ticket.status === 'OPEN' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleStatusChange(ticket.id!, 'IN_PROGRESS')} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    Start
                  </button>
                  <button onClick={() => handleStatusChange(ticket.id!, 'REJECTED')} className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                    Reject
                  </button>
                </div>
              )}
              {ticket.status === 'IN_PROGRESS' && (
                <button onClick={() => handleStatusChange(ticket.id!, 'RESOLVED')} className="bg-green-600 text-white px-2 py-1 rounded text-sm mt-2">
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}