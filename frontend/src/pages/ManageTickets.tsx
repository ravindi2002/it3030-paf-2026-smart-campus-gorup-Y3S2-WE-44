import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ManageTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets').then(res => setTickets(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
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