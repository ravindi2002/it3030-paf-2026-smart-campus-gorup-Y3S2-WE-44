import { ResourceStatus } from '../types/Resource';

interface ResourceFormProps {
  initialData?: Partial<ResourceStatus>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ResourceForm({ initialData, onSubmit, onCancel }: ResourceFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      resourceType: (form.elements.namedItem('resourceType') as HTMLInputElement).value,
      capacity: parseInt((form.elements.namedItem('capacity') as HTMLInputElement).value) || undefined,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input name="name" required defaultValue={initialData?.name} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" defaultValue={initialData?.description} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Location *</label>
        <input name="location" required defaultValue={initialData?.location} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Resource Type</label>
        <input name="resourceType" defaultValue={initialData?.resourceType} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Capacity</label>
        <input name="capacity" type="number" defaultValue={initialData?.capacity} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
}