'use client';

import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function CourseCatalogContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [filterType, setFilterType] = useState<string>('all'); // all | free | paid

  useEffect(() => {
    fetchCourses();
  }, [searchParams]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const s = searchParams.get('search') || search;
      const c = searchParams.get('category') || selectedCategory;

      let url = `/api/courses?search=${encodeURIComponent(s)}&category=${encodeURIComponent(c)}`;
      if (filterType === 'free') url += '&isFree=true';
      if (filterType === 'paid') url += '&isFree=false';

      const res = await fetch(url);
      const data = await res.json();

      setCourses(data.courses || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setFilterType('all');
    window.history.pushState({}, '', '/courses');
    setTimeout(fetchCourses, 50);
  };

  return (
    <>
      {/* Search & Filter Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setTimeout(fetchCourses, 50);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Free/Paid Filter */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setTimeout(fetchCourses, 50);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prices (Free & Paid)</option>
            <option value="free">Free Courses Only</option>
            <option value="paid">Paid Courses Only</option>
          </select>

          <button
            onClick={resetFilters}
            className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-gray-600 text-xs flex items-center space-x-1"
            title="Reset Filters"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 text-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <div>Loading courses...</div>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center my-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Courses Found</h3>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't find any courses matching your search criteria. Try adjusting your query or filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const lessonCount = course.sections.reduce(
              (acc: number, sec: any) => acc + (sec.lessons?.length || 0),
              0
            );
            return (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                price={course.price}
                isFree={course.isFree}
                thumbnailUrl={course.thumbnailUrl}
                categoryName={course.category?.name}
                sectionCount={course.sections.length}
                lessonCount={lessonCount}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default function CourseCatalogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Course Catalog</h1>
          <p className="text-gray-600 text-sm">
            Browse our full selection of video courses, tutorials, and certification tracks.
          </p>
        </div>

        <Suspense fallback={<div className="text-gray-500">Loading catalog...</div>}>
          <CourseCatalogContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
