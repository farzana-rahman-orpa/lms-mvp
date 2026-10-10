'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import PDFViewer from '@/components/PDFViewer';
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  FileText,
  Lock,
  ArrowLeft,
  ChevronRight,
  Menu,
  X,
  Award,
  Share2,
  MessageSquare,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function CoursePlayerPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources'>('overview');

  useEffect(() => {
    fetchCourseAndLesson();
  }, [params.slug, params.lessonId]);

  const fetchCourseAndLesson = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${params.slug}`);
      if (!res.ok) throw new Error('Course not found');
      const data = await res.json();

      setCourse(data.course);
      setIsEnrolled(data.isEnrolled);
      setProgressMap(data.userProgressMap || {});

      // Access control check
      if (!data.isEnrolled) {
        router.push(`/courses/${data.course.slug}`);
        return;
      }

      // Find current lesson
      let foundLesson: any = null;
      data.course.sections.forEach((sec: any) => {
        sec.lessons.forEach((les: any) => {
          if (les.id === params.lessonId) {
            foundLesson = les;
          }
        });
      });

      if (!foundLesson && data.course.sections[0]?.lessons[0]) {
        foundLesson = data.course.sections[0].lessons[0];
      }

      setCurrentLesson(foundLesson);

      // Compute total & completed
      let total = 0;
      let completedCount = 0;
      data.course.sections.forEach((sec: any) => {
        sec.lessons.forEach((les: any) => {
          total++;
          if (data.userProgressMap && data.userProgressMap[les.id]) {
            completedCount++;
          }
        });
      });

      const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      setCompletionPercentage(pct);
    } catch (err) {
      console.error('Course player error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (lessonId: string) => {
    const nextState = !progressMap[lessonId];
    try {
      const res = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextState }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProgressMap((prev) => ({ ...prev, [lessonId]: nextState }));
        setCompletionPercentage(data.completionPercentage);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center text-slate-400">Loading Future Light Course Player...</div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center text-red-400">Access denied or lesson not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Udemy-Style Player Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <Link
            href={`/courses/${course.slug}`}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Back to Course Details"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="border-l border-slate-800 pl-3">
            <h1 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1">{course.title}</h1>
            <span className="text-[11px] text-purple-400 font-semibold">{currentLesson.title}</span>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <Award className="h-4 w-4 text-amber-400" />
            <span className="text-slate-300 font-bold">{completionPercentage}% Completed</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 flex items-center space-x-1.5 text-xs font-bold"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="hidden sm:inline">Course Content</span>
          </button>
        </div>
      </header>

      {/* Player Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Player Component */}
            {currentLesson.type === 'VIDEO' ? (
              <VideoPlayer
                url={currentLesson.contentUrl}
                title={currentLesson.title}
                isCompleted={Boolean(progressMap[currentLesson.id])}
                onComplete={() => handleToggleComplete(currentLesson.id)}
              />
            ) : currentLesson.type === 'PDF' ? (
              <PDFViewer
                url={currentLesson.contentUrl}
                title={currentLesson.title}
                isCompleted={Boolean(progressMap[currentLesson.id])}
                onComplete={() => handleToggleComplete(currentLesson.id)}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{currentLesson.title}</h2>
                    <span className="text-xs text-slate-400">Written Reading Material</span>
                  </div>
                  <button
                    onClick={() => handleToggleComplete(currentLesson.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 transition ${
                      progressMap[currentLesson.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{progressMap[currentLesson.id] ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {currentLesson.contentText || 'No written content provided for this lesson.'}
                </div>
              </div>
            )}

            {/* Udemy Tabs under Player */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-6 border-b border-slate-800 pb-3 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 border-b-2 transition ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-white font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Overview & Details
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3 border-b-2 transition ${
                    activeTab === 'resources'
                      ? 'border-purple-500 text-white font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Downloadable Resources
                </button>
              </div>

              <div className="pt-4 text-xs text-slate-300">
                {activeTab === 'overview' ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white">About this lecture</h3>
                    <p className="text-slate-400 leading-relaxed">
                      {currentLesson.contentText || currentLesson.title}
                    </p>
                    <div className="pt-2 text-slate-500 text-[11px]">
                      Instructor: Future Light Global Academy Team
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white mb-2">Lecture Resources</h3>
                    {currentLesson.contentUrl ? (
                      <a
                        href={currentLesson.contentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-purple-400 font-semibold"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download Material Link ({currentLesson.type})</span>
                      </a>
                    ) : (
                      <p className="text-slate-500">No additional files attached to this lecture.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>

        {/* Right Udemy-Style Content Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto shrink-0 p-4">
            <h3 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Course Content Outline
            </h3>

            <div className="space-y-4">
              {course.sections.map((section: any, idx: number) => (
                <div key={section.id} className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 px-2 py-1.5 bg-slate-800/80 rounded-md">
                    Section {idx + 1}: {section.title}
                  </div>

                  <div className="space-y-1 pl-1 pt-1">
                    {section.lessons.map((les: any) => {
                      const isActive = les.id === currentLesson.id;
                      const isDone = Boolean(progressMap[les.id]);

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            router.push(`/learn/${course.slug}/${les.id}`);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition ${
                            isActive
                              ? 'bg-purple-600 text-white font-bold shadow-md'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            {isDone ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : les.type === 'VIDEO' ? (
                              <PlayCircle className="h-4 w-4 text-purple-400 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-red-400 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>

                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {les.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
