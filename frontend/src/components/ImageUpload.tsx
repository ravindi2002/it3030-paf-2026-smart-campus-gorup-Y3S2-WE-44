import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/uploads/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('smartcampus_token')}`,
        },
        body: formData,
      });
      const data = await response.json();
      onUpload(data.url);
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
      {uploading && <span className="text-sm text-gray-500 ml-2">Uploading...</span>}
    </div>
  );
}