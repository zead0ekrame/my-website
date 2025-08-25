'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Client = {
  id: string;
  name: string;
  slug: string;
  email: string;
  systemPrompt?: string | null;
  model?: string | null;
  temperature?: number | null;
  tokenLimitMonthly?: number | null;
  createdAt: string;
};

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};

type ChatSession = {
  id: string;
  messages: Message[];
  totalTokens: number;
  createdAt: string;
};

export default function ClientDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'history'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [sessionTokens, setSessionTokens] = useState(0);
  
  // Settings state
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [tokenLimit, setTokenLimit] = useState(100000);
  
  // History state
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  
  const availableModels = [
    'qwen/qwen2.5-vl-32b-instruct:free',
    'anthropic/claude-3.5-sonnet:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'openai/gpt-4o-mini:free',
    'google/gemini-flash-1.5:free'
  ];

  useEffect(() => {
    loadClientData();
    loadChatHistory();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      const res = await fetch(`/api/client/${clientId}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
        setSystemPrompt(data.client.systemPrompt || '');
        setSelectedModel(data.client.model || availableModels[0]);
        setTemperature(data.client.temperature || 0.7);
        setTokenLimit(data.client.tokenLimitMonthly || 100000);
      } else {
        console.error('Failed to load client data:', res.status);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const res = await fetch(`/api/admin/usage?clientId=${clientId}`);
      if (res.ok) {
        const data = await res.json();
        // Transform usage data to chat history format
        const history = data.clients?.[0]?.sessions || [];
        setChatHistory(history.map((s: any) => ({
          id: s.sessionId || 'unknown',
          messages: [],
          totalTokens: s._sum.totalTokens || 0,
          createdAt: new Date().toISOString()
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      const res = await fetch('/api/openrouter/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          clientId,
          sessionId: `client-${clientId}-${Date.now()}`,
          model: selectedModel,
          temperature,
          system: systemPrompt
        })
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setIsStreaming(false);
                const finalMessage: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: assistantMessage,
                  createdAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, finalMessage]);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.choices?.[0]?.delta?.content) {
                  assistantMessage += parsed.choices[0].delta.content;
                  setStreamingMessage(assistantMessage);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch(`/api/client/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          model: selectedModel,
          temperature,
          tokenLimitMonthly: tokenLimit
        })
      });

      if (res.ok) {
        alert('تم حفظ الإعدادات بنجاح');
        loadClientData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'فشل في حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('فشل في حفظ الإعدادات');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientId');
    localStorage.removeItem('clientName');
    router.push('/client-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-2xl text-blue-600">جاري التحميل...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">لم يتم العثور على العميل</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                لوحة تحكم {client.name}
              </h1>
              <p className="text-slate-600 mt-2">إدارة الشات بوت والإعدادات</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">العميل: {client.email}</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
          <div className="flex space-x-2 space-x-reverse">
            {[
              { id: 'chat', label: 'الشات بوت', icon: '💬' },
              { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
              { id: 'history', label: 'التاريخ', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">الشات بوت المتقدم</h2>
                <div className="text-sm text-slate-500">
                  النموذج: {selectedModel} | الحرارة: {temperature}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-slate-50 rounded-2xl p-6 h-96 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="text-sm opacity-75 mb-1">
                        {message.role === 'user' ? 'أنت' : 'المساعد'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isStreaming && streamingMessage && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800">
                      <div className="text-sm opacity-75 mb-1">المساعد</div>
                      <div className="whitespace-pre-wrap">
                        {streamingMessage}
                        <span className="animate-pulse">▊</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isStreaming}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isStreaming}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60 transition-all duration-200"
                >
                  {isStreaming ? 'جاري الإرسال...' : 'إرسال'}
                </button>
              </div>

              {/* Session Info */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <div className="text-sm text-emerald-700">
                  الرسائل: {messages.length} | التوكنز المستخدمة: {sessionTokens}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800">إعدادات الشات بوت</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      System Prompt
                    </label>
                    <textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل التعليمات الأساسية للبوت..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      النموذج
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      الحرارة (Temperature)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-slate-500 mt-1">
                      {temperature} - {temperature < 0.5 ? 'محدد' : temperature < 1 ? 'متوازن' : 'مبدع'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      حد التوكنز الشهري
                    </label>
                    <input
                      type="number"
                      value={tokenLimit}
                      onChange={(e) => setTokenLimit(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100000"
                    />
                  </div>

                  <button
                    onClick={saveSettings}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
                  >
                    حفظ الإعدادات
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">تاريخ المحادثات</h2>
              
              {chatHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  لا توجد محادثات سابقة
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((session) => (
                    <div key={session.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800">جلسة {session.id.slice(-8)}</div>
                          <div className="text-sm text-slate-500">
                            {new Date(session.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600">
                          {session.totalTokens} توكن
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
