import { Link } from 'react-router-dom';
import { Resource } from '../types/Resource';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {resource.imageUrl && (
        <img src={resource.imageUrl} alt={resource.name} className="w-full h-40 object-cover rounded" />
      )}
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{resource.name}</h3>
          <StatusBadge status={resource.status} />
        </div>
        <p className="text-gray-600 text-sm mt-2">{resource.location}</p>
        {resource.resourceType && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
            {resource.resourceType}
          </span>
        )}
        {resource.capacity && (
          <p className="text-gray-500 text-sm mt-2">Capacity: {resource.capacity}</p>
        )}
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <button onClick={() => onEdit(resource.id!)} className="text-blue-600 hover:underline text-sm">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(resource.id!)} className="text-red-600 hover:underline text-sm">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}