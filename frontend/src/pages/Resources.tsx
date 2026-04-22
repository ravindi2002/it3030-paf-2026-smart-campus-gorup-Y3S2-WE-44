import { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { Resource } from '../types/Resource';
import ResourceCard from '../components/ResourceCard';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourceService.getAll().then(setResources).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Delete this resource?')) {
      await resourceService.delete(id);
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <a href="/resources/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Resource
        </a>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}