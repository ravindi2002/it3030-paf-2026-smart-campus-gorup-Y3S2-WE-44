interface BookingFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function BookingForm({ initialData, onSubmit, onCancel }: BookingFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      resourceId: parseInt((form.elements.namedItem('resourceId') as HTMLInputElement).value),
      startTime: (form.elements.namedItem('startTime') as HTMLInputElement).value,
      endTime: (form.elements.namedItem('endTime') as HTMLInputElement).value,
      purpose: (form.elements.namedItem('purpose') as HTMLTextAreaElement).value,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Resource ID *</label>
        <input name="resourceId" type="number" required defaultValue={initialData?.resourceId} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start Time *</label>
          <input name="startTime" type="datetime-local" required defaultValue={initialData?.startTime} className="mt-1 block w-full rounded border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">End Time *</label>
          <input name="endTime" type="datetime-local" required defaultValue={initialData?.endTime} className="mt-1 block w-full rounded border p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Purpose</label>
        <textarea name="purpose" defaultValue={initialData?.purpose} className="mt-1 block w-full rounded border p-2" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book</button>
      </div>
    </form>
  );
}