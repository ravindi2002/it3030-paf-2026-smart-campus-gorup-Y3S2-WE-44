import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Equipment', 'Internet/Network', 'Air Conditioning', 'Other'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export default function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', priority: 'MEDIUM', location: '' });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = localStorage.getItem('smartcampus_user');
      const user = userData ? JSON.parse(userData) : null;
      if (!user?.id) { setError('Please log in to create a ticket'); setLoading(false); return; }
      await api.post('/tickets', { ...formData, imageUrl: imagePreview || null }, { params: { userId: user.id } });
      navigate('/tickets');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create ticket'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="Brief description of the issue" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-md">
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
          <select required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-md">
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Room 101, Building A" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="Describe the issue in detail..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border rounded-md" />
          {imagePreview && <div className="mt-2"><img src={imagePreview} alt="Preview" className="max-h-40 rounded-md" /><button type="button" onClick={() => setImagePreview(null)} className="mt-1 text-sm text-red-600">Remove</button></div>}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Ticket'}</button>
          <button type="button" onClick={() => navigate('/tickets')} className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}