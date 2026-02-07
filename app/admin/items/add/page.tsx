'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, isAdmin } from '@/lib/auth';
import { items as itemsData } from '@/lib/data';
import { ArrowLeft, Save, Package } from 'lucide-react';
import Link from 'next/link';

export default function AddItemPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    floor: '',
    aisle: '',
    rack: '',
    shelf: '',
    quantity: '',
    minStockLevel: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.name || !formData.category || !formData.floor || !formData.aisle || !formData.rack || !formData.shelf || !formData.quantity) {
      setError('All location and required fields are mandatory');
      setLoading(false);
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        category: formData.category,
        floor: formData.floor,
        aisle: formData.aisle,
        rack: formData.rack,
        shelf: formData.shelf,
        quantity: parseInt(formData.quantity),
        minStockLevel: parseInt(formData.minStockLevel) || 0,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        image: imagePreview,
        createdBy: user?.username || 'admin',
      };

      console.log('Sending data:', itemData);

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok && result.success) {
        setSuccess('✅ Item added successfully!');
        setTimeout(() => {
          router.push('/admin/items');
        }, 1500);
      } else {
        setError(`❌ ${result.error || 'Failed to add item'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      imageUrl: url,
    });
    setImagePreview(url);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({
          ...formData,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4">
            <Link 
              href="/admin/items"
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add New Item</h1>
              <p className="text-sm text-gray-500">Fill in the details to add a new item</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Item Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Item Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., HP Mouse"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  list="category-options"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Select or type a category"
                  required
                />
                <datalist id="category-options">
                  <option value="Electronics" />
                  <option value="Stationery" />
                  <option value="Electrical" />
                  <option value="Home & Kitchen" />
                  <option value="Clothing" />
                  <option value="Sports" />
                  <option value="Toys" />
                  <option value="Books" />
                </datalist>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 299.99"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🖼️ Product Image
            </h2>
            
            {/* Upload Type Toggle */}
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="url"
                  checked={imageUploadType === 'url'}
                  onChange={(e) => setImageUploadType(e.target.value as 'url' | 'file')}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Image URL</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="file"
                  checked={imageUploadType === 'file'}
                  onChange={(e) => setImageUploadType(e.target.value as 'url' | 'file')}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Upload File</span>
              </label>
            </div>

            {/* Image URL Input */}
            {imageUploadType === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* File Upload Input */}
            {imageUploadType === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📍 Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor *
                </label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Ground Floor, 1st Floor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aisle *
                </label>
                <input
                  type="text"
                  name="aisle"
                  value={formData.aisle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., A3, B5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rack *
                </label>
                <input
                  type="text"
                  name="rack"
                  value={formData.rack}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., R2, R5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shelf *
                </label>
                <input
                  type="text"
                  name="shelf"
                  value={formData.shelf}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., S4, S1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📦 Stock Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 25"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 10"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Item'}
            </button>
            <Link
              href="/admin/items"
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
