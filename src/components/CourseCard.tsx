import Link from 'next/link';
import { Star, CheckCircle, Clock, BookOpen, User } from 'lucide-react';

export interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  isFree: boolean;
  thumbnailUrl?: string | null;
  categoryName?: string;
  sectionCount?: number;
  lessonCount?: number;
  isEnrolled?: boolean;
}

export default function CourseCard({
  id,
  title,
  slug,
  description,
  price,
  isFree,
  thumbnailUrl,
  categoryName,
  sectionCount = 0,
  lessonCount = 0,
  isEnrolled = false,
}: CourseCardProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Thumbnail Container */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={thumbnailUrl || fallbackImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition"></div>
        
        {/* Category Pill */}
        {categoryName && (
          <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            {categoryName}
          </span>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Udemy Bestseller Tag */}
          <div className="flex items-center space-x-2 mb-1">
            {isFree ? (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                Free Tutorial
              </span>
            ) : (
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                Bestseller
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-600 transition line-clamp-2 leading-tight mb-1">
            <Link href={`/courses/${slug}`}>{title}</Link>
          </h3>

          {/* Instructor Line */}
          <div className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center space-x-1">
            <User className="h-3 w-3 text-slate-400" />
            <span>Future Light Academy Instructors</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mb-2">
            <span>4.8</span>
            <div className="flex items-center text-amber-400">
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
              <Star className="h-3 w-3 fill-amber-400" />
            </div>
            <span className="text-slate-400 font-normal text-[11px]">(1,420)</span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3 text-slate-400" />
              <span>{sectionCount} Sections</span>
            </div>
            {lessonCount > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{lessonCount} Lectures</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Price and Action */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            {isFree || price === 0 ? (
              <span className="text-emerald-700 font-extrabold text-base">Free</span>
            ) : (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-slate-900 font-extrabold text-lg">${price.toFixed(2)}</span>
                <span className="text-slate-400 text-xs line-through font-normal">${(price * 1.5).toFixed(2)}</span>
              </div>
            )}
          </div>

          {isEnrolled ? (
            <Link
              href={`/courses/${slug}`}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition flex items-center space-x-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Enrolled</span>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}`}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold rounded-lg transition"
            >
              {isFree || price === 0 ? 'Enroll Free' : 'View Course'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
