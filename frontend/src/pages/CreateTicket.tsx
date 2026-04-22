import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import TicketForm from '../components/TicketForm';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../hooks/useAuth';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleSubmit = async (data: any) => {
    try {
      const userId = (user as any)?.id || 1;
      const payload = { ...data, imageUrl };
      await ticketService.create(payload, userId);
      navigate('/tickets');
    } catch (err) {
      setError('Failed to create ticket');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow">
        <TicketForm onSubmit={handleSubmit} onCancel={() => navigate('/tickets')} />
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Attach Image</label>
          <ImageUpload onUpload={setImageUrl} />
        </div>
      </div>
    </div>
  );
}