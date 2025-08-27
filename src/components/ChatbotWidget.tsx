'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '../lib/constants';
import { processUserMessage, OpenRouterMessage, streamUserMessage } from '../lib/chat-api';
import { IntentResult } from '../lib/simple-intent-detector';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'أهلاً بيك يا صديقي 👋 أنا مساعد إيجي أفريكا. أقدر أساعدك في التسويق الإلكتروني والذكاء الاصطناعي. تحب نبدأ بإيه؟', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<OpenRouterMessage[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ total: number } | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastIntent, setLastIntent] = useState<IntentResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleBotClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage = inputText.trim();
      const newMessage = {
        id: messages.length + 1,
        text: userMessage,
        isBot: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        // إضافة رسالة المستخدم للتاريخ
        const userOpenRouterMessage: OpenRouterMessage = {
          role: 'user',
          content: userMessage
        };

        // معالجة الرسالة مع Intent Detection
        const result = await processUserMessage(userMessage, conversationHistory, sessionId || undefined);
        
        // حفظ النية المكتشفة
        if (result.intent) {
          setLastIntent(result.intent);
        }

        // إذا كانت النية لا تحتاج LangChain، استخدم الرد المباشر
        if (!result.intent?.shouldUseLangChain) {
          const botMessage = {
            id: messages.length + 2,
            text: result.response,
            isBot: true
          };
          setMessages(prev => [...prev, botMessage]);
          
          // تحديث تاريخ المحادثة
          const botOpenRouterMessage: OpenRouterMessage = {
            role: 'assistant',
            content: result.response
          };
          
          setConversationHistory(prev => [
            ...prev,
            userOpenRouterMessage,
            botOpenRouterMessage
          ]);
          
          setIsLoading(false);
          return;
        }

        // إذا كانت النية تحتاج LangChain، استخدم Streaming
        const baseId = messages.length + 2;
        setMessages(prev => [...prev, { id: baseId, text: '', isBot: true }]);
        let finalText = '';
        
        try {
          const controller = new AbortController();
          abortRef.current = controller;
          setIsStreaming(true);
          const startedAt = performance.now();
          
          finalText = await streamUserMessage(
            userMessage,
            conversationHistory,
            sessionId || undefined,
            (delta) => {
              setMessages(prev => prev.map(m => m.id === baseId ? { ...m, text: (m.text + delta) } : m));
            },
            { signal: controller.signal }
          );
          
          setLatencyMs(Math.round(performance.now() - startedAt));
        } catch (e) {
          // fallback لو البث فشل
          finalText = result.response;
          setMessages(prev => prev.map(m => m.id === baseId ? { ...m, text: finalText } : m));
        } finally {
          setIsStreaming(false);
          abortRef.current = null;
        }

        // تحديث تاريخ المحادثة
        if (finalText) {
          const botOpenRouterMessage: OpenRouterMessage = {
            role: 'assistant',
            content: finalText
          };
          
          setConversationHistory(prev => [
            ...prev,
            userOpenRouterMessage,
            botOpenRouterMessage
          ]);
        }

      } catch (error) {
        console.error('Error processing message:', error);
        
        // رد احتياطي في حالة الخطأ
        const errorMessage = {
          id: messages.length + 2,
          text: 'عذراً، حدث خطأ. يمكنك التواصل معنا عبر واتساب للحصول على مساعدة فورية.',
          isBot: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto focus input when opening chat
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Load active client from localStorage
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('activeClientId') : null;
      if (stored) setActiveClient(stored);
    } catch {}
  }, []);

  // Ensure sessionId
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      let sid = localStorage.getItem('chatSessionId');
      if (!sid) {
        sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem('chatSessionId', sid);
      }
      setSessionId(sid);
    } catch {}
  }, []);

  // Fetch usage summary
  useEffect(() => {
    const fetchUsage = async () => {
      if (!sessionId) return;
      const params = new URLSearchParams();
      params.set('sessionId', sessionId);
      if (activeClient) params.set('clientId', activeClient);
      try {
        const res = await fetch(`/api/usage/summary?${params.toString()}`);
        const d = await res.json();
        if (res.ok) setUsage({ total: d.totalTokens || 0 });
      } catch {}
    };
    fetchUsage();
  }, [sessionId, activeClient, messages.length]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;

    const actionMessages: { [key: string]: string } = {
      'ai': 'أريد معرفة المزيد عن خدمات الذكاء الاصطناعي',
      'marketing': 'أريد معرفة المزيد عن التسويق الإلكتروني'
    };

    const message = actionMessages[action];
    if (message) {
      setInputText(message);
      // إرسال الرسالة تلقائياً
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Modern AI Bot Button */}
      <div className="relative">
        {/* Floating AI Bot Icon */}
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleBotClick}
          className="group relative w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-white/20 animate-bounce"
          aria-label="ابدأ محادثة مع البوت الذكي"
        >
          {/* Bot Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-2xl animate-pulse">🤖</div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          
          {/* Status Indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping">
            <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </button>
        
        {/* Hover Tooltip */}
        {isHovered && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
            <div className="text-center">
              <div className="font-semibold mb-1">البوت الذكي</div>
              <div className="text-xs text-slate-300">اضغط لبدء المحادثة</div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full right-4 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-slate-800"></div>
          </div>
        )}
      </div>
      
      {/* Chat Bot Interface */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-80 md:w-96 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Bot Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">البوت الذكي</div>
                  <div className="text-xs text-emerald-100">
                    {activeClient ? `العميل: ${activeClient}` : 'متصل بـ OpenRouter AI'}
                    {usage ? ` • Tokens: ${usage.total}` : ''}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div ref={messagesContainerRef} className="h-64 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start space-x-2 space-x-reverse ${message.isBot ? '' : 'justify-end'}`}>
                {message.isBot && (
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🤖</span>
                  </div>
                )}
                <div className={`rounded-xl px-3 py-2 max-w-xs shadow ${message.isBot ? 'bg-slate-100 text-slate-700' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'}`}>
                  <p className="text-sm">{message.text}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(message.text)}
                  className="ml-1 text-xs text-slate-400 hover:text-slate-600"
                  title="نسخ"
                >
                  ⎘
                </button>
                {!message.isBot && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white">👤</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-2 space-x-reverse">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">🤖</span>
                </div>
                <div className="bg-slate-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1 space-x-reverse">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <div>{isStreaming ? 'يكتب الآن…' : latencyMs !== null ? `زمن الاستجابة: ${latencyMs}ms` : ''}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { if (abortRef.current) { abortRef.current.abort(); } }}
                  disabled={!isStreaming}
                  className="px-2 py-1 border rounded-md disabled:opacity-50"
                >
                  إيقاف
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button 
                onClick={() => handleQuickAction('ai')}
                disabled={isLoading}
                className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                خدمات الذكاء الاصطناعي
              </button>
              <button 
                onClick={() => handleQuickAction('marketing')}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التسويق الإلكتروني
              </button>
            </div>
            
            {/* Input Field */}
            <div className="flex space-x-2 space-x-reverse">
              <input 
                ref={inputRef}
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالتك هنا..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* WhatsApp Button for Mobile */}
      <div className="mt-4 md:hidden">
        <a
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-14 h-14 bg-green-500 text-white rounded-2xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          aria-label="تواصل معنا على واتساب"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
