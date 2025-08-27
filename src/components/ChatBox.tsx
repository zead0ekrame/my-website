"use client";

import { useState, useRef, useEffect } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
  ConversationHeader
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    source?: string;
  };
}

interface ChatBoxProps {
  tenantId?: string;
  projectId?: string;
  channel?: 'web' | 'whatsapp' | 'messenger' | 'instagram';
  className?: string;
}

export default function ChatBox({ 
  tenantId = 'demo', 
  projectId = 'demo', 
  channel = 'web',
  className = '' 
}: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'أهلاً وسهلاً! كيف أقدر أساعدك اليوم؟ 😊',
      timestamp: new Date(),
      metadata: { source: 'welcome' }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي للأسفل
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // إرسال رسالة
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    // إضافة رسالة المستخدم
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // إرسال الرسالة للـ API
      const response = await fetch('/api/client/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          tenantId,
          projectId,
          channel,
          sessionId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // حفظ session ID
        if (data.data.sessionId && !sessionId) {
          setSessionId(data.data.sessionId);
        }

        // إضافة رد المساعد
        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          metadata: {
            intent: data.data.intent,
            confidence: data.data.confidence,
            source: data.data.metadata?.source
          }
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // رسالة خطأ
        const errorMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: 'عذراً، حدث خطأ في معالجة رسالتك. حاول مرة أخرى.',
          timestamp: new Date(),
          metadata: { source: 'error' }
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت.',
        timestamp: new Date(),
        metadata: { source: 'error' }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // تحويل الرسائل لصيغة chatscope
  const chatMessages = messages.map(msg => ({
    id: msg.id,
    message: msg.content,
    sender: msg.role === 'user' ? 'user' : 'assistant',
    direction: msg.role === 'user' ? 'outgoing' : 'incoming',
    position: 'single',
    timestamp: msg.timestamp
  }));

  return (
    <div className={`h-[600px] w-full max-w-md mx-auto ${className}`}>
      <MainContainer responsive>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">ب</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Privacy Meta Bot</div>
                  <div className="text-xs text-gray-500">دعم فني ذكي</div>
                </div>
              </div>
            </ConversationHeader.Content>
          </ConversationHeader>
          
          <MessageList
            typingIndicator={isTyping ? <TypingIndicator content="جاري الكتابة..." /> : null}
            className="bg-gray-50"
          >
            {chatMessages.map((msg, index) => (
              <Message
                key={msg.id}
                model={{
                  message: msg.message,
                  sender: msg.sender,
                  direction: msg.direction,
                  position: msg.position,
                  timestamp: msg.timestamp
                }}
              />
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
          
          <MessageInput
            placeholder="اكتب رسالتك هنا..."
            value={inputValue}
            onChange={(val) => setInputValue(val)}
            onSend={handleSendMessage}
            attachButton={false}
            className="border-t border-gray-200"
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
