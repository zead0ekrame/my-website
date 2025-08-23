import { FEATURES } from '../lib/constants';

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">لماذا تختارنا؟</h2>
          <p className="section-subtitle">
            نتميز بالخبرة والاحترافية في تقديم حلول رقمية عالية الجودة
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-textDark mb-3">{feature.title}</h3>
              <p className="text-textGray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
