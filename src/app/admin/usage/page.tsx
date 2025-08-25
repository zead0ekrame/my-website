'use client';

import { useEffect, useState } from 'react';

type UsageSession = { sessionId: string | null; _sum: { totalTokens: number | null } };
type UsageClient = { client: { id: string; name: string; slug: string }; totalTokens: number; sessions: UsageSession[] };

export default function UsageAdminPage() {
  const [month, setMonth] = useState<string>('');
  const [data, setData] = useState<{ totalTokens: number; clients: UsageClient[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientFilter, setClientFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (month) params.set('month', month);
      if (clientFilter) params.set('clientId', clientFilter);
      if (sessionFilter) params.set('session', sessionFilter);
      const res = await fetch(`/api/admin/usage?${params.toString()}`);
      const d = await res.json();
      if (res.ok) setData({ totalTokens: d.totalTokens || 0, clients: d.clients || [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-textDark">استهلاك التوكنز</h1>
            <p className="text-sm text-textGray">لوحة لمتابعة الاستهلاك لكل عميل والجلسات</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="client id/slug"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="session contains"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={loadData} className="btn-primary">تحديث</button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-textGray">جارٍ التحميل...</div>
        ) : !data ? (
          <div className="text-sm text-textGray">لا توجد بيانات</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="text-sm text-textGray">المجموع العام</div>
              <div className="text-2xl font-bold">{data.totalTokens} Tokens</div>
            </div>

            {data.clients.map((c) => (
              <div key={c.client.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{c.client.name}</div>
                    <div className="text-xs text-textGray">/{c.client.slug}</div>
                  </div>
                  <div className="text-lg font-bold">{c.totalTokens} Tokens</div>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">الجلسات</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {c.sessions.length === 0 ? (
                      <div className="text-sm text-textGray">لا توجد جلسات</div>
                    ) : (
                      c.sessions.map((s, idx) => (
                        <div key={`${s.sessionId || 'unknown'}-${idx}`} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="text-xs text-textGray">{s.sessionId || 'unknown'}</div>
                          <div className="text-sm font-medium">{s._sum.totalTokens || 0} Tokens</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


