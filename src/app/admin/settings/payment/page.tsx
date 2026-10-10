'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle, Lock } from 'lucide-react';

export default function AdminPaymentSettingsPage() {
  const [activeGateway, setActiveGateway] = useState<'MOCK' | 'STRIPE'>('MOCK');
  const [testMode, setTestMode] = useState(true);
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings/payment')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setActiveGateway(data.settings.activeGateway || 'MOCK');
          setTestMode(data.settings.testMode ?? true);
          setStripePublicKey(data.settings.stripePublicKey || '');
          setStripeSecretKey(data.settings.stripeSecretKey || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeGateway,
          testMode,
          stripePublicKey,
          stripeSecretKey,
        }),
      });

      if (!res.ok) throw new Error('Failed to update payment settings');

      setMsg('Payment gateway settings updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading payment settings...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Payment Gateway Configuration</h1>
        <p className="text-gray-500 text-sm">Configure API keys, toggle between Mock Gateway and Stripe Test/Live modes.</p>
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

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Active Payment Gateway Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setActiveGateway('MOCK')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  activeGateway === 'MOCK'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-sm text-gray-900">Built-in Mock Gateway</div>
                <span className="text-xs text-gray-500 mt-1">Instant test checkout with zero setup</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGateway('STRIPE')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  activeGateway === 'STRIPE'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-sm text-gray-900">Stripe Payment Gateway</div>
                <span className="text-xs text-gray-500 mt-1">Accept real cards via Stripe API keys</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-gray-900">Test / Sandbox Mode</div>
              <div className="text-xs text-gray-500">Enable test card transactions without charging real money</div>
            </div>
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="h-5 w-5 text-purple-600 rounded"
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
              <Lock className="h-4 w-4 text-purple-600" />
              <span>Stripe Credentials</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stripe Publishable Key</label>
              <input
                type="text"
                placeholder="pk_test_..."
                value={stripePublicKey}
                onChange={(e) => setStripePublicKey(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stripe Secret Key</label>
              <input
                type="password"
                placeholder="sk_test_..."
                value={stripeSecretKey}
                onChange={(e) => setStripeSecretKey(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Gateway Configuration'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
