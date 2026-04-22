import { useState } from 'react';
import { Priority } from '../types/Ticket';

interface TicketFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function TicketForm({ initialData, onSubmit, onCancel }: TicketFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
      category: (form.elements.namedItem('category') as HTMLInputElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title *</label>
        <input name="title" required defaultValue={initialData?.title} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description *</label>
        <textarea name="description" required defaultValue={initialData?.description} className="mt-1 block w-full rounded border p-2" rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Priority *</label>
          <select name="priority" required defaultValue={initialData?.priority || 'MEDIUM'} className="mt-1 block w-full rounded border p-2">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input name="category" defaultValue={initialData?.category} className="mt-1 block w-full rounded border p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input name="location" defaultValue={initialData?.location} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </div>
    </form>
  );
}