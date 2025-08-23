import { SERVICES } from '../lib/constants';
import ServiceCard from './ServiceCard';

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">خدماتنا</h2>
          <p className="section-subtitle">
            نقدم مجموعة شاملة من الخدمات الرقمية لمساعدة أعمالك على النمو والتطور
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
