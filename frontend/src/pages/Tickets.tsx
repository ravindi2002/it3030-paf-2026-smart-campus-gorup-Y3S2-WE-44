import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import { Ticket } from '../types/Ticket';
import TicketCard from '../components/TicketCard';
import { useAuth } from '../hooks/useAuth';

export default function Tickets() {
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      ticketService.getAll().then(setTickets).finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incident Tickets</h1>
        {isAuthenticated() && (
          <a href="/tickets/create" className="bg-blue-600 text-white px-4 py-2 rounded">
            Report Issue
          </a>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}