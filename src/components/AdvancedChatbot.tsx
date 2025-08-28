'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'file';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

export default function AdvancedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'أهلاً بيك! أنا مساعد ذكي متقدم. أقدر أتعامل مع النصوص، الصوت، الصور، والملفات! 🚀',
      isBot: true,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const languages: Language[] = [
    { code: 'ar', name: 'العربية', flag: '🇪🇬' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `أفهم سؤالك: "${inputText}"! هذا رد تجريبي من البوت المتقدم. 🎯`,
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: 'رسالة صوتية',
          isBot: false,
          timestamp: new Date(),
          type: 'voice',
          mediaUrl: audioUrl
        };

        setMessages(prev => [...prev, voiceMessage]);
        
        // Simulate bot voice response
        setTimeout(() => {
          const botVoiceResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: 'أفهم رسالتك الصوتية! هذا رد تجريبي من البوت. 🎤',
            isBot: true,
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, botVoiceResponse]);
        }, 1500);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('لا يمكن الوصول للميكروفون');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage: Message = {
      id: Date.now().toString(),
      text: `ملف: ${file.name}`,
      isBot: false,
      timestamp: new Date(),
      type: 'file',
      fileName: file.name,
      fileSize: file.size
    };

    setMessages(prev => [...prev, fileMessage]);

    // Simulate bot file analysis
    setTimeout(() => {
      const botFileResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `حللت الملف "${file.name}"! حجمه ${(file.size / 1024).toFixed(1)} KB. هذا رد تجريبي من البوت. 📁`,
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botFileResponse]);
    }, 2000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageMessage: Message = {
        id: Date.now().toString(),
        text: 'صورة',
        isBot: false,
        timestamp: new Date(),
        type: 'image',
        mediaUrl: e.target?.result as string
      };

      setMessages(prev => [...prev, imageMessage]);

      // Simulate bot image analysis
      setTimeout(() => {
        const botImageResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'حللت الصورة! أرى أنها صورة جميلة. هذا رد تجريبي من البوت. 🖼️',
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botImageResponse]);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const toggleLanguage = () => {
    const currentIndex = languages.findIndex(lang => lang.code === selectedLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setSelectedLanguage(languages[nextIndex].code);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-40 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">مساعد ذكي متقدم</h3>
                  <p className="text-sm opacity-90">يدعم النصوص، الصوت، الصور، والملفات</p>
                </div>
              </div>
              <button
                onClick={toggleLanguage}
                className="text-2xl hover:scale-110 transition-transform"
                title="تغيير اللغة"
              >
                {languages.find(lang => lang.code === selectedLanguage)?.flag}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.type === 'text' && (
                    <p className="text-sm">{message.text}</p>
                  )}
                  
                  {message.type === 'voice' && (
                    <div className="flex items-center gap-2">
                      <span>🎤</span>
                      <audio controls className="w-32 h-8">
                        <source src={message.mediaUrl} type="audio/wav" />
                      </audio>
                    </div>
                  )}
                  
                  {message.type === 'image' && (
                    <div>
                      <img 
                        src={message.mediaUrl} 
                        alt="Uploaded" 
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {message.type === 'file' && (
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      <div>
                        <p className="text-xs font-medium">{message.fileName}</p>
                        <p className="text-xs opacity-75">{message.fileSize && formatFileSize(message.fileSize)}</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">جاري الكتابة...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-gray-50">
            {/* Media Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="إرسال صورة"
              >
                📷
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="إرسال ملف"
              >
                📁
              </button>
              
              <button
                onMouseDown={startVoiceRecording}
                onMouseUp={stopVoiceRecording}
                onMouseLeave={stopVoiceRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title="تسجيل صوتي"
              >
                🎤
              </button>
            </div>

            {/* Text Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ➤
              </button>
            </div>
          </div>

          {/* Hidden Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          />
          <input
            ref={imageInputRef}
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      )}
    </>
  );
}
