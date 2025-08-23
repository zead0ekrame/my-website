export default function Testimonials() {
  const testimonials = [
    {
      name: 'أحمد محمد',
      company: 'شركة التقنية المتقدمة',
      text: 'خدمة ممتازة! البوت الذكي ساعدنا في زيادة المبيعات بنسبة 40%',
      rating: 5
    },
    {
      name: 'سارة أحمد',
      company: 'متجر الأزياء الأنيق',
      text: 'فريق محترف ومتجاوب، النتائج تجاوزت توقعاتنا بكثير',
      rating: 5
    },
    {
      name: 'محمد علي',
      company: 'مطعم الشرق الأوسط',
      text: 'خدمة عملاء ممتازة ودعم فني مستمر، أنصح الجميع بالتجربة',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">آراء عملائنا</h2>
          <p className="section-subtitle">
            اكتشف ما يقوله عملاؤنا عن خدماتنا
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-textGray mb-6 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-textDark">{testimonial.name}</p>
                <p className="text-sm text-textGray">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
