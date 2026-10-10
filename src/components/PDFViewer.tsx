'use client';

import { FileText, Download, ExternalLink, CheckCircle } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export default function PDFViewer({ url, title, onComplete, isCompleted }: PDFViewerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <span className="text-xs text-gray-500">PDF Material & Document</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </a>
          )}

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
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="h-[600px] w-full bg-gray-100 p-2">
        {url ? (
          <iframe
            src={url}
            className="w-full h-full rounded-lg border border-gray-300"
            title={title}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            PDF document link is missing.
          </div>
        )}
      </div>
    </div>
  );
}
