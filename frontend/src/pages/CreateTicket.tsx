import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Equipment', 'Internet/Network', 'Air Conditioning', 'Other'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export default function CreateTicket() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [resources, setResources] = useState<Array<{id: number, name: string, location: string}>>([]);
  
  // 🔥 INNOVATION: Get resourceId from URL (Scan to Report feature)
  const prefillResourceId = searchParams.get('resourceId');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    location: '',
    resourceId: prefillResourceId ? parseInt(prefillResourceId) : undefined,
    preferredContact: ''
  });

  // Fetch resources for dropdown
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/admin/resources');
      setResources(response.data || []);
    } catch (err) {
      console.error('Failed to load resources');
    }
  };

  // 🔥 Multiple image upload (max 3) using File objects
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    // Check max 3 images
    if (fileArray.length + imageFiles.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }
    
    // Validate each file
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
    }
    
    // Add to files array
    setImageFiles([...imageFiles, ...fileArray]);
    
    // Create previews
    const newPreviews: string[] = [];
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === fileArray.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // 🔥 SUBMIT USING FORMDATA (FIXES FILE UPLOAD)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = localStorage.getItem('smartcampus_user');
      const user = userData ? JSON.parse(userData) : null;
      if (!user?.id) {
        setError('Please log in to create a ticket');
        setLoading(false);
        return;
      }
      
      // 🔥 Create FormData for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      data.append('location', formData.location || '');
      data.append('preferredContact', formData.preferredContact || '');
      
      if (formData.resourceId) {
        data.append('resourceId', formData.resourceId.toString());
      }
      
      // Append images (max 3)
      imageFiles.forEach((file) => {
        data.append('images', file);
      });
      
      // 🔥 Send with multipart/form-data to new endpoint with-images
      await api.post('/tickets/with-images', data, {
        params: { userId: user.id },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/tickets');
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  // Get selected resource for display
  const selectedResource = resources.find(r => r.id === formData.resourceId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Home
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          🚨 Report an Issue
        </h1>
        {prefillResourceId && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            📱 Quick Report
          </span>
        )}
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        {/* 🔥 Auto-selected resource display */}
        {prefillResourceId && selectedResource && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-700 font-medium">
                Resource pre-selected: {selectedResource.name}
              </span>
            </div>
            {selectedResource.location && (
              <span className="text-xs text-green-600 ml-6">{selectedResource.location}</span>
            )}
          </div>
        )}
        
        {/* 1. Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Projector not working in Lab 301"
          />
        </div>

        {/* 2. Category & Priority Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITIES.map(pri => (
                <option key={pri} value={pri}>
                  {pri === 'HIGH' ? '🔴 HIGH' : pri === 'MEDIUM' ? '🟡 MEDIUM' : '🟢 LOW'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 3. Resource / Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resource / Location
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={formData.resourceId || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                resourceId: e.target.value ? parseInt(e.target.value) : undefined,
                location: e.target.value ? resources.find(r => r.id === parseInt(e.target.value))?.location || '' : ''
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select resource (optional)</option>
              {resources.map(res => (
                <option key={res.id} value={res.id}>{res.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Or enter location"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 Tip: Scan QR code on equipment to auto-select
          </p>
        </div>
        
        {/* 4. Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the issue in detail..."
          />
        </div>
        
        {/* 🔥 5. Image Evidence (MAX 3) - Using File objects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📸 Image Evidence (max 3)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              disabled={imageFiles.length >= 3}
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="text-gray-500">
                <span className="text-2xl">📷</span>
                <p className="text-sm">
                  {imageFiles.length >= 3 
                    ? 'Max 3 images reached' 
                    : 'Click to upload images'
                  }
                </p>
                <p className="text-xs text-gray-400">JPG, PNG up to 5MB each</p>
              </div>
            </label>
            
            {/* Image Previews with File objects */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-3 justify-center flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                    <p className="text-xs text-gray-500 truncate max-w-20">
                      {imageFiles[index]?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 6. Preferred Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact
          </label>
          <input
            type="email"
            value={formData.preferredContact}
            onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@sliit.lk"
          />
        </div>
        
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? '⏳ Creating Ticket...' : '🚨 Submit Ticket'}
        </button>
      </form>
    </div>
  );
}