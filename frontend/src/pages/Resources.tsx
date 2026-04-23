import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then(res => setResources(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <a href="/resources/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Resource
        </a>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-gray-600 text-sm">{r.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}