import { useNavigate } from 'react-router-dom';

export default function CreateResource() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Resource</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Resource creation form coming soon...</p>
        <button onClick={() => navigate('/resources')} className="mt-4 bg-gray-200 px-4 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
}