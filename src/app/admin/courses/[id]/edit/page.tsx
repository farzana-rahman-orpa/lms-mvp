'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Save,
  PlayCircle,
  FileText,
  CheckCircle,
  Video
} from 'lucide-react';

export default function EditCourseBuilderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Course Edit Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [isFree, setIsFree] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // New Section State
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  // New Lesson Modal State
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'VIDEO' | 'PDF' | 'ARTICLE'>('VIDEO');
  const [lessonUrl, setLessonUrl] = useState('');
  const [lessonText, setLessonText] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10');
  const [addingLesson, setAddingLesson] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}`);
      if (!res.ok) throw new Error('Course not found');
      const data = await res.json();

      setCourse(data.course);
      setTitle(data.course.title);
      setDescription(data.course.description);
      setPrice(data.course.price.toString());
      setIsFree(data.course.isFree);
      setIsPublished(data.course.isPublished);
      setThumbnailUrl(data.course.thumbnailUrl || '');
      setCategoryId(data.course.categoryId || '');

      const catRes = await fetch('/api/courses');
      const catData = await catRes.json();
      setCategories(catData.categories || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching course details');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const res = await fetch(`/api/courses/${params.id}`, {
        method: 'PUT',
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
      if (!res.ok) throw new Error(data.error || 'Failed to update course');

      setMsg('Course settings updated successfully!');
      fetchCourseDetails();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setAddingSection(true);

    try {
      const res = await fetch(`/api/courses/${params.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSectionTitle.trim(),
          order: (course?.sections?.length || 0) + 1,
        }),
      });

      if (!res.ok) throw new Error('Failed to create section');
      setNewSectionTitle('');
      fetchCourseDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all its lessons?')) return;
    try {
      await fetch(`/api/sections/${sectionId}`, { method: 'DELETE' });
      fetchCourseDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionId || !lessonTitle.trim()) return;
    setAddingLesson(true);

    try {
      const res = await fetch(`/api/sections/${activeSectionId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lessonTitle.trim(),
          type: lessonType,
          contentUrl: lessonUrl.trim() || undefined,
          contentText: lessonText.trim() || undefined,
          durationMinutes: parseInt(lessonDuration, 10),
        }),
      });

      if (!res.ok) throw new Error('Failed to create lesson');

      setActiveSectionId(null);
      setLessonTitle('');
      setLessonUrl('');
      setLessonText('');
      fetchCourseDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      fetchCourseDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm('WARNING: Are you sure you want to permanently delete this course? This action cannot be undone.')) return;
    try {
      await fetch(`/api/courses/${params.id}`, { method: 'DELETE' });
      router.push('/admin/courses');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading course builder...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/admin/courses" className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Course Builder & Editor</h1>
            <p className="text-gray-500 text-xs">Manage metadata, sections, lessons, videos, and PDFs</p>
          </div>
        </div>

        <button
          onClick={handleDeleteCourse}
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg text-xs flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Course</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* 1. Metadata Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <span>1. General Course Settings</span>
        </h2>

        <form onSubmit={handleCourseUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFreeEdit"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <label htmlFor="isFreeEdit" className="text-xs font-bold text-gray-900">
                Free Course
              </label>
            </div>

            {!isFree && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs bg-white"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublishedEdit"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <label htmlFor="isPublishedEdit" className="text-xs font-bold text-gray-900">
                Published
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 text-xs shadow-md flex items-center space-x-1"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save General Settings'}</span>
          </button>
        </form>
      </div>

      {/* 2. Course Section & Lesson Builder */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <span>2. Content Structure (Course → Sections → Lessons)</span>
        </h2>

        {/* Sections List */}
        <div className="space-y-6">
          {course?.sections?.map((section: any, idx: number) => (
            <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
              <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-sm">
                  Section {idx + 1}: {section.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveSectionId(section.id)}
                    className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-md text-xs hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Lesson</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                    title="Delete Section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List inside Section */}
              <div className="p-4 divide-y divide-gray-200 bg-white">
                {section.lessons.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 italic">No lessons added to this section yet.</p>
                ) : (
                  section.lessons.map((les: any) => (
                    <div key={les.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {les.type === 'VIDEO' ? (
                          <PlayCircle className="h-4 w-4 text-blue-500" />
                        ) : les.type === 'PDF' ? (
                          <FileText className="h-4 w-4 text-red-500" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-emerald-500" />
                        )}
                        <div>
                          <span className="font-bold text-gray-900">{les.title}</span>
                          <span className="text-gray-400 ml-2">({les.type} • {les.durationMinutes}m)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(les.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form: Add New Section */}
        <form onSubmit={handleAddSection} className="flex gap-3 pt-2">
          <input
            type="text"
            required
            placeholder="New Section Title (e.g. Module 3: Advanced Concepts)..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={addingSection}
            className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 text-xs shadow-sm flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </form>
      </div>

      {/* Modal: Add New Lesson */}
      {activeSectionId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              Add New Lesson to Section
            </h3>

            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Video 1: Getting Started"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Content Type</label>
                  <select
                    value={lessonType}
                    onChange={(e: any) => setLessonType(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="VIDEO">Video Stream / MP4</option>
                    <option value="PDF">PDF Document</option>
                    <option value="ARTICLE">Article / Text</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {lessonType !== 'ARTICLE' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {lessonType === 'VIDEO' ? 'Video Stream URL (MP4 / HTTPS Link)' : 'PDF File Download / Embed URL'}
                  </label>
                  <input
                    type="url"
                    value={lessonUrl}
                    onChange={(e) => setLessonUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4 or document.pdf"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Article Text / Description</label>
                <textarea
                  rows={3}
                  value={lessonText}
                  onChange={(e) => setLessonText(e.target.value)}
                  placeholder="Lesson body text or study instructions..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setActiveSectionId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLesson}
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
