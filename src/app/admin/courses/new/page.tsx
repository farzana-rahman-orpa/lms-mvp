'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Save } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('49.99');
  const [isFree, setIsFree] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setCategoryId(data.categories[0].id);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: isFree ? 0 : parseFloat(price),
          isFree,
          isPublished,
          thumbnailUrl,
          categoryId: categoryId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create course');

      router.push(`/admin/courses/${data.course.id}/edit`);
    } catch (err: any) {
      setError(err.message || 'Creation failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Link href="/admin/courses" className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 text-xs">Set up course details, pricing, and category</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master React & Next.js 14"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive course outline and learning outcomes..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Thumbnail Image URL</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Pricing & Visibility */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFree"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <label htmlFor="isFree" className="text-sm font-bold text-gray-900">
                Mark as Free Course ($0.00 Enrollment)
              </label>
            </div>

            {!isFree && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <label htmlFor="isPublished" className="text-sm font-bold text-gray-900">
                Publish Immediately (Visible in Course Catalog)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Creating...' : 'Create & Proceed to Content Builder'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
