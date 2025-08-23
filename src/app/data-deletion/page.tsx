'use client';

import { useEffect } from 'react';
import { SITE } from '../../lib/constants';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';

export default function DataDeletionPage() {
  useEffect(() => {
    // Redirect to the original data deletion page
    window.location.href = SITE.legal.deletionUrl;
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-br from-background to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title">حذف البيانات</h1>
          <p className="section-subtitle">
            يتم توجيهك إلى صفحة حذف البيانات الرسمية...
          </p>
          
          <div className="mt-8">
            <a
              href={SITE.legal.deletionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              انتقل إلى صفحة حذف البيانات
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
