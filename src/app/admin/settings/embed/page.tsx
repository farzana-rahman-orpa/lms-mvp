'use client';

import { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Globe, Layers } from 'lucide-react';

export default function AdminEmbedSettingsPage() {
  const [parentUrl, setParentUrl] = useState('https://yourmainwebsite.com');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const iframeSnippet = `<iframe
  src="http://localhost:3000/courses?embed=true&returnUrl=${encodeURIComponent(parentUrl)}"
  width="100%"
  height="750"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="LearnSphere LMS Courses"
></iframe>`;

  const directLinkSnippet = `<a 
  href="http://localhost:3000/courses?returnUrl=${encodeURIComponent(parentUrl)}" 
  target="_blank"
  style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none;"
>
  Explore Online Courses &rarr;
</a>`;

  const singleCourseSnippet = `<iframe
  src="http://localhost:3000/courses/nextjs-prisma-mastery?embed=true&returnUrl=${encodeURIComponent(parentUrl)}"
  width="100%"
  height="600"
  style="border: none; border-radius: 12px;"
></iframe>`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Website Integration & Embedding</h1>
        <p className="text-gray-500 text-sm">
          Copy-paste ready snippets to reference or embed this LMS website seamlessly on another parent website.
        </p>
      </div>

      {/* Parent URL Config Box */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="font-bold text-gray-900 text-base flex items-center space-x-2">
          <Globe className="h-5 w-5 text-purple-600" />
          <span>Parent Website Configuration</span>
        </h2>
        <p className="text-xs text-gray-500">
          Enter the domain or URL of your main website to automatically populate back-links and return redirects.
        </p>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Website Base URL</label>
          <input
            type="url"
            value={parentUrl}
            onChange={(e) => setParentUrl(e.target.value)}
            placeholder="https://yourmainwebsite.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
          />
        </div>
      </div>

      {/* Snippet 1: Iframe Portal */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-sm text-gray-900 flex items-center space-x-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>1. Complete Course Portal Iframe Embed</span>
          </div>
          <button
            onClick={() => copyToClipboard(iframeSnippet, 1)}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs hover:bg-blue-100 flex items-center space-x-1"
          >
            {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedIndex === 1 ? 'Copied!' : 'Copy Snippet'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Embeds the full course catalog directly inside a container on your main website. Hides site navbar/footer for seamless iframe integration.
        </p>
        <pre className="bg-gray-900 text-blue-300 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {iframeSnippet}
        </pre>
      </div>

      {/* Snippet 2: Direct CTA Button Link */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-sm text-gray-900 flex items-center space-x-2">
            <ExternalLink className="h-4 w-4 text-emerald-600" />
            <span>2. Direct Link / CTA Button to LMS Portal</span>
          </div>
          <button
            onClick={() => copyToClipboard(directLinkSnippet, 2)}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs hover:bg-emerald-100 flex items-center space-x-1"
          >
            {copiedIndex === 2 ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedIndex === 2 ? 'Copied!' : 'Copy Snippet'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          HTML button code to place on your main website. Redirects users to the LMS with an automatic "Return to Main Website" navigation bar.
        </p>
        <pre className="bg-gray-900 text-emerald-300 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {directLinkSnippet}
        </pre>
      </div>

      {/* Snippet 3: Single Course Embed */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-sm text-gray-900 flex items-center space-x-2">
            <Code className="h-4 w-4 text-purple-600" />
            <span>3. Single Course Landing Page Embed</span>
          </div>
          <button
            onClick={() => copyToClipboard(singleCourseSnippet, 3)}
            className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold rounded-lg text-xs hover:bg-purple-100 flex items-center space-x-1"
          >
            {copiedIndex === 3 ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedIndex === 3 ? 'Copied!' : 'Copy Snippet'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Embed a specific single course page inside a blog post or landing page on your main site.
        </p>
        <pre className="bg-gray-900 text-purple-300 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {singleCourseSnippet}
        </pre>
      </div>
    </div>
  );
}
