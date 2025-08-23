import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import { SERVICES } from '../../lib/constants';

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-br from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">كل الخدمات</h1>
            <p className="section-subtitle">
              اكتشف مجموعة شاملة من الخدمات الرقمية المصممة لتنمية أعمالك
            </p>
          </div>
          
          <div className="space-y-16">
            {SERVICES.map((service, index) => (
              <div key={service.id} className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2">
                  <div className="text-6xl mb-6">{service.icon}</div>
                  <h2 className="text-3xl font-bold text-textDark mb-4">{service.title}</h2>
                  <p className="text-lg text-textGray mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold text-textDark mb-3">حالات الاستخدام:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-textGray">
                          <span className="text-primary ml-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <a href={service.ctaLink} className="btn-primary">
                    {service.cta}
                  </a>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="card h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold text-textDark">{service.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
