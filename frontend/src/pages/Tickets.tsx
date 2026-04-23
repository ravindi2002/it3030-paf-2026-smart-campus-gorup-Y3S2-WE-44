import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets').then(res => setTickets(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incident Tickets</h1>
        <a href="/tickets/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Report Issue
        </a>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map(t => (
            <Link key={t.id} to={`/tickets/${t.id}`} className="bg-white p-4 rounded-lg shadow hover:shadow-md">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{t.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  t.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  t.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>{t.priority}</span>
                <span className="text-gray-500 text-sm">{t.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}