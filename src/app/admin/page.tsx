'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Tab = 'overview' | 'clients' | 'usage';
type Client = { id: string; name: string; slug: string; email: string; systemPrompt?: string | null; model?: string | null; temperature?: number | null; createdAt: string };
type UsageSession = { sessionId: string | null; _sum: { totalTokens: number | null } };
type UsageClient = { client: { id: string; name: string; slug: string }; totalTokens: number; sessions: UsageSession[] };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [usageData, setUsageData] = useState<{ totalTokens: number; clients: UsageClient[] } | null>(null);
  const [month, setMonth] = useState<string>('');
  const [clientFilter, setClientFilter] = useState('');
    const [sessionFilter, setSessionFilter] = useState('');
  const [activeClientId, setActiveClientId] = useState<string>('');
  const [activeClientName, setActiveClientName] = useState<string>('');
  
  const loadClients = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      setClients(data.clients || []);
    } catch {}
  };

  const loadUsage = async () => {
    try {
      const params = new URLSearchParams();
      if (month) params.set('month', month);
      if (clientFilter) params.set('clientId', clientFilter);
      if (sessionFilter) params.set('session', sessionFilter);
      const res = await fetch(`/api/admin/usage?${params.toString()}`);
      const d = await res.json();
      if (res.ok) setUsageData({ totalTokens: d.totalTokens || 0, clients: d.clients || [] });
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'clients') loadClients();
    if (activeTab === 'usage') loadUsage();
  }, [activeTab, month, clientFilter, sessionFilter]);

  // Load clients on component mount
  useEffect(() => {
    loadClients();
    // Load active client from localStorage
    const storedClientId = localStorage.getItem('activeClientId');
    const storedClientName = localStorage.getItem('activeClientName');
    if (storedClientId && storedClientName) {
      setActiveClientId(storedClientId);
      setActiveClientName(storedClientName);
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: '📊' },
    { id: 'clients', label: 'العملاء', icon: '👥' },
    { id: 'usage', label: 'الاستهلاك', icon: '📈' }
  ] as const;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                لوحة الإدارة
              </h1>
              <p className="text-slate-600 mt-2">إدارة العملاء والاستهلاك والإعدادات</p>
            </div>
            <button 
              onClick={handleLogout} 
              disabled={loading} 
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-60 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? '...' : 'تسجيل الخروج'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
          <div className="flex space-x-2 space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-white/20">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <div className="text-blue-100">إجمالي العملاء</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-2xl font-bold">{usageData?.totalTokens || 0}</div>
                  <div className="text-green-100">إجمالي التوكنز</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="text-2xl font-bold">
                    {activeClientName || 'غير محدد'}
                  </div>
                  <div className="text-purple-100">
                    {activeClientId ? 'العميل النشط' : 'لم يتم تحديد عميل'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-4">إحصائيات سريعة</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-indigo-600">العملاء النشطين</span>
                      <span className="font-semibold">{clients.filter(c => c.model || c.systemPrompt).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-600">أحدث عميل</span>
                      <span className="font-semibold">{clients[0]?.name || 'لا يوجد'}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-4">أحدث النشاط</h3>
                  <div className="text-emerald-600 text-sm">
                    {usageData?.clients[0] ? (
                      <div>
                        <div>أعلى عميل: {usageData.clients[0].client.name}</div>
                        <div>التوكنز: {usageData.clients[0].totalTokens}</div>
                      </div>
                    ) : 'لا يوجد نشاط حديث'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">إدارة العملاء</h2>
                <button 
                  onClick={loadClients}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                >
                  تحديث القائمة
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-semibold mb-4 text-blue-800">إضافة عميل جديد</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1 text-blue-700">الاسم</label>
                      <input 
                        id="newClientName"
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="اسم العميل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-blue-700">Slug</label>
                      <input 
                        id="newClientSlug"
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="slug-مثال"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-blue-700">البريد الإلكتروني</label>
                      <input 
                        id="newClientEmail"
                        type="email"
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-blue-700">كلمة المرور</label>
                      <input 
                        id="newClientPassword"
                        type="password"
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="كلمة مرور قوية"
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        const name = (document.getElementById('newClientName') as HTMLInputElement)?.value;
                        const slug = (document.getElementById('newClientSlug') as HTMLInputElement)?.value;
                        const email = (document.getElementById('newClientEmail') as HTMLInputElement)?.value;
                        const password = (document.getElementById('newClientPassword') as HTMLInputElement)?.value;
                        
                        if (!name || !slug || !email || !password) {
                          alert('جميع الحقول مطلوبة');
                          return;
                        }
                        
                        try {
                          const res = await fetch('/api/admin/clients', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, slug, email, password })
                          });
                          
                          if (res.ok) {
                            alert('تم إضافة العميل بنجاح');
                            (document.getElementById('newClientName') as HTMLInputElement).value = '';
                            (document.getElementById('newClientSlug') as HTMLInputElement).value = '';
                            (document.getElementById('newClientEmail') as HTMLInputElement).value = '';
                            (document.getElementById('newClientPassword') as HTMLInputElement).value = '';
                            loadClients();
                          } else {
                            const error = await res.json();
                            alert(error.error || 'فشل في إضافة العميل');
                          }
                        } catch (error) {
                          alert('حدث خطأ في الاتصال');
                        }
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                    >
                      إضافة عميل
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="font-semibold mb-4 text-green-800">قائمة العملاء</h3>
                  {clients.length === 0 ? (
                    <div className="text-sm text-green-600">لا يوجد عملاء بعد</div>
                  ) : (
                    <div className="space-y-3">
                      {clients.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                          <div>
                            <div className="font-medium text-green-800">{c.name}</div>
                            <div className="text-xs text-green-600">/{c.slug}</div>
                            <div className="text-xs text-green-500">{c.email}</div>
                            <div className="text-xs text-green-400">
                              {c.model ? `النموذج: ${c.model}` : 'بدون نموذج محدد'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/clients/${c.id}`, {
                                    method: 'DELETE'
                                  });
                                  if (res.ok) {
                                    alert('تم حذف العميل بنجاح');
                                    loadClients();
                                  } else {
                                    alert('فشل في حذف العميل');
                                  }
                                } catch (error) {
                                  alert('حدث خطأ في الاتصال');
                                }
                              }}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                              حذف
                            </button>
                            <button 
                              onClick={async () => {
                                localStorage.setItem('activeClientId', c.id);
                                localStorage.setItem('activeClientName', c.name);
                                alert(`تم تعيين ${c.name} كعميل نشط`);
                              }}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              تعيين كنشط
                            </button>
                            <Link 
                              href={`/client/${c.id}`}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                            >
                              لوحة العميل
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">لوحة الاستهلاك</h2>
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
                  <button onClick={loadUsage} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200">
                    تحديث
                  </button>
                </div>
              </div>

              {usageData && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                    <div className="text-sm text-purple-600">المجموع العام</div>
                    <div className="text-3xl font-bold text-purple-800">{usageData.totalTokens} Tokens</div>
                  </div>

                  {usageData.clients.map((c) => (
                    <div key={c.client.id} className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-semibold text-slate-800">{c.client.name}</div>
                          <div className="text-xs text-slate-600">/{c.client.slug}</div>
                        </div>
                        <div className="text-lg font-bold text-slate-800">{c.totalTokens} Tokens</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2 text-slate-700">الجلسات</div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {c.sessions.length === 0 ? (
                            <div className="text-sm text-slate-500">لا توجد جلسات</div>
                          ) : (
                            c.sessions.map((s, idx) => (
                              <div key={`${s.sessionId || 'unknown'}-${idx}`} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                                <div className="text-xs text-slate-500">{s.sessionId || 'unknown'}</div>
                                <div className="text-sm font-medium text-slate-700">{s._sum.totalTokens || 0} Tokens</div>
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
          )}
        </div>
      </div>
    </main>
  );
}


