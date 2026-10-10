'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function AdminSiteSettingsPage() {
  const [siteName, setSiteName] = useState('LearnSphere LMS');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('support@learnsphere.com');
  const [currency, setCurrency] = useState('USD');
  const [termsText, setTermsText] = useState('');
  const [refundPolicyText, setRefundPolicyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings/site')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSiteName(data.settings.siteName || '');
          setLogoUrl(data.settings.logoUrl || '');
          setContactEmail(data.settings.contactEmail || '');
          setCurrency(data.settings.currency || 'USD');
          setTermsText(data.settings.termsText || '');
          setRefundPolicyText(data.settings.refundPolicyText || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          logoUrl,
          contactEmail,
          currency,
          termsText,
          refundPolicyText,
        }),
      });

      if (res.ok) setMsg('Website settings saved successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading site settings...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Basic Website Settings</h1>
        <p className="text-gray-500 text-sm">Site branding, contact info, default currency, terms, and refund policy pages.</p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Default Currency</label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Support / Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Terms of Service Content</label>
            <textarea
              rows={4}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Refund Policy Content</label>
            <textarea
              rows={4}
              value={refundPolicyText}
              onChange={(e) => setRefundPolicyText(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Website Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
