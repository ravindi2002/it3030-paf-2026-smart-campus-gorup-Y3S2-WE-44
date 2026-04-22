import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import ResourceForm from '../components/ResourceForm';
import { useAuth } from '../hooks/useAuth';

export default function CreateResource() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      const userId = (user as any)?.id || 1;
      await resourceService.create(data, userId);
      navigate('/resources');
    } catch (err) {
      setError('Failed to create resource');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Resource</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <ResourceForm onSubmit={handleSubmit} onCancel={() => navigate('/resources')} />
    </div>
  );
}