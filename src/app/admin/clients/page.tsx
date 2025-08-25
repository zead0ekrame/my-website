'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: string;
  name: string;
  slug: string;
  systemPrompt?: string | null;
  model?: string | null;
  temperature?: number | null;
  createdAt: string;
};

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeClientId, setActiveClientId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState<string>('');

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      setClients(data.clients || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('activeClientId') : null;
      if (stored) setActiveClientId(stored);
    } catch {}
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || undefined,
          systemPrompt: systemPrompt || undefined,
          model: model || undefined,
          temperature: temperature === '' ? undefined : Number(temperature),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'فشل إنشاء العميل');
        return;
      }
      setName('');
      setSlug('');
      setSystemPrompt('');
      setModel('');
      setTemperature('');
      await loadClients();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف العميل؟')) return;
    await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
    await loadClients();
  };

  const handleSetActive = (idOrSlug: string) => {
    try {
      localStorage.setItem('activeClientId', idOrSlug);
      setActiveClientId(idOrSlug);
      alert('تم تعيين العميل كنشط لبوت الدردشة');
    } catch {}
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-textDark mb-2">العملاء</h1>
        <p className="text-sm text-textGray mb-6">العميل النشط حالياً: {activeClientId ? <span className="font-medium">{activeClientId}</span> : 'لا يوجد'}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">إضافة عميل جديد</h2>
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">الاسم</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm mb-1">Slug (اختياري)</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm mb-1">نموذج LLM (اختياري)</label>
                <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="qwen/qwen2.5-vl-32b-instruct:free" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm mb-1">Temperature (اختياري)</label>
                <input value={temperature} onChange={(e) => setTemperature(e.target.value)} type="number" step="0.1" min="0" max="2" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm mb-1">System Prompt (اختياري)</label>
                <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4">القائمة</h2>
            {loading ? (
              <div className="text-sm text-textGray">جارٍ التحميل...</div>
            ) : clients.length === 0 ? (
              <div className="text-sm text-textGray">لا يوجد عملاء بعد</div>
            ) : (
              <div className="space-y-3">
                {clients.map((c) => (
                  <div key={c.id} className="flex items-start justify-between p-3 border rounded-lg gap-3">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-textGray">/{c.slug}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleSetActive(c.slug || c.id)} className="px-3 py-1.5 text-xs rounded-md border hover:bg-slate-50">تعيين كالنشط</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 text-sm hover:underline">حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


