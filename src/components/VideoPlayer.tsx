'use client';

import { Play, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export default function VideoPlayer({ url, title, onComplete, isCompleted }: VideoPlayerProps) {
  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
      <div className="relative aspect-video w-full bg-gray-900 flex items-center justify-center">
        {url ? (
          <video
            controls
            src={url}
            className="w-full h-full object-contain"
            controlsList="nodownload"
            poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
          >
            Your browser does not support video playback.
          </video>
        ) : (
          <div className="text-gray-400 text-sm flex flex-col items-center">
            <Play className="h-12 w-12 text-gray-600 mb-2" />
            <span>No video stream URL provided for this lesson</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <span className="text-xs text-gray-400">Video Lesson</span>
        </div>

        {onComplete && (
          <button
            onClick={onComplete}
            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center space-x-2 transition ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>{isCompleted ? 'Marked as Completed' : 'Mark as Complete'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
