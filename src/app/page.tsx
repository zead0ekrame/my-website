import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ServicesGrid />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
