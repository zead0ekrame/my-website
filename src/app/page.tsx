import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ServicesGrid from '../components/ServicesGrid';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import AdvancedChatbot from '../components/AdvancedChatbot';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="hidden lg:block absolute top-28 right-8 z-0 pointer-events-none">
          <div className="text-right opacity-50 max-w-lg">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 leading-tight tracking-tight">
              حلول تقنية متقدمة — منصة الذكاء الاصطناعي
            </h1>
          </div>
        </div>
        <Hero />
        <Features />
        <ServicesGrid />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <AdvancedChatbot />
    </>
  );
}
