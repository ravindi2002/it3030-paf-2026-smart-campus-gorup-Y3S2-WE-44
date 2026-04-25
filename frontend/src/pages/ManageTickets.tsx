import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function ManageTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets').then(res => setTickets(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-6">Manage Tickets</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-gray-600 text-sm">{t.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}