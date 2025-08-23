'use client';

import { useEffect } from 'react';
import { SITE } from '../../lib/constants';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';

export default function TermsPage() {
  useEffect(() => {
    // Redirect to the original terms page
    window.location.href = SITE.legal.termsUrl;
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-br from-background to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title">الشروط والأحكام</h1>
          <p className="section-subtitle">
            يتم توجيهك إلى صفحة الشروط والأحكام الرسمية...
          </p>
          
          <div className="mt-8">
            <a
              href={SITE.legal.termsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              انتقل إلى صفحة الشروط والأحكام
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
