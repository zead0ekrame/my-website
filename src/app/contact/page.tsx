'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import { SITE } from '../../lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send email using mailto
    const subject = `طلب تواصل جديد - ${formData.name}`;
    const body = `
اسم العميل: ${formData.name}
الشركة: ${formData.company}
الهاتف: ${formData.phone}
البريد الإلكتروني: ${formData.email}
الخدمة المطلوبة: ${formData.service}
الرسالة: ${formData.message}
    `;
    
    const mailtoUrl = `mailto:${SITE.emailPrimary}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-br from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">تواصل معنا</h1>
            <p className="section-subtitle">
              نحن هنا لمساعدتك في تحقيق أهدافك الرقمية
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-textDark mb-6">أرسل لنا رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-textDark mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-textDark mb-2">
                      الشركة
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-textDark mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-textDark mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-textDark mb-2">
                    الخدمة المطلوبة
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    <option value="">اختر الخدمة</option>
                    <option value="chatbot">بوت ماسنجر بالذكاء الاصطناعي</option>
                    <option value="marketing">التسويق الإلكتروني</option>
                    <option value="media">ميديا ومونتاج وفيديوهات</option>
                    <option value="graphic">تصميم جرافيك وهوية</option>
                    <option value="photography">تصوير فوتوغرافي & UGC</option>
                    <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-textDark mb-2">
                    الرسالة *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                
                <button type="submit" className="btn-primary w-full">
                  إرسال الرسالة
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-textDark mb-6">معلومات التواصل</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-primary text-xl ml-3 mt-1">📍</div>
                    <div>
                      <h3 className="font-semibold text-textDark">العنوان</h3>
                      <p className="text-textGray">{SITE.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-primary text-xl ml-3 mt-1">📞</div>
                    <div>
                      <h3 className="font-semibold text-textDark">الهاتف</h3>
                      <a href={`tel:${SITE.phone}`} className="text-primary hover:underline">
                        {SITE.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-primary text-xl ml-3 mt-1">✉️</div>
                    <div>
                      <h3 className="font-semibold text-textDark">البريد الإلكتروني</h3>
                      <a href={`mailto:${SITE.emailPrimary}`} className="text-primary hover:underline">
                        {SITE.emailPrimary}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-2xl font-bold text-textDark mb-6">تواصل سريع</h2>
                
                <div className="space-y-4">
                  <a
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <span className="ml-2">💬</span>
                    تواصل معنا على واتساب
                  </a>
                  
                  <a
                    href="/book"
                    className="flex items-center justify-center bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <span className="ml-2">📅</span>
                    احجز استشارة
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
