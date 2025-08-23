import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatbotWidget from '../../components/ChatbotWidget';
import { SITE } from '../../lib/constants';

export default function BookPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-br from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">احجز استشارة</h1>
            <p className="section-subtitle">
              احجز استشارة مجانية خلال 15 دقيقة وناقش احتياجاتك مع خبرائنا
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* WhatsApp Booking */}
              <div className="card text-center">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-2xl font-bold text-textDark mb-4">احجز على واتساب</h2>
                <p className="text-textGray mb-6">
                  تواصل معنا مباشرة على واتساب واحجز استشارة فورية. 
                  سنرد عليك خلال دقائق ونحدد موعد مناسب لك.
                </p>
                
                <div className="space-y-4">
                  <a
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold w-full"
                  >
                    <span className="ml-2">💬</span>
                    احجز استشارة على واتساب
                  </a>
                  
                  <p className="text-sm text-textGray">
                    ⏰ متاح من الأحد إلى الخميس: 9 ص - 6 م
                  </p>
                </div>
              </div>
              
              {/* Calendly Booking */}
              <div className="card text-center">
                <div className="text-6xl mb-6">📅</div>
                <h2 className="text-2xl font-bold text-textDark mb-4">احجز عبر كالندلي</h2>
                <p className="text-textGray mb-6">
                  اختر الموعد المناسب لك من جدولنا الزمني. 
                  احجز استشارة فيديو أو مكالمة هاتفية.
                </p>
                
                {SITE.calendlyUrl ? (
                  <a
                    href={SITE.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                  >
                    احجز موعد الآن
                  </a>
                ) : (
                  <div className="space-y-4">
                    <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                      قريباً - احجز موعد الآن
                    </button>
                    <p className="text-sm text-textGray">
                      سيتم تفعيل الحجز عبر كالندلي قريباً
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* What to Expect */}
            <div className="mt-16">
              <div className="card">
                <h2 className="text-2xl font-bold text-textDark mb-6 text-center">ماذا تتوقع من الاستشارة؟</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="font-semibold text-textDark mb-2">تحليل احتياجاتك</h3>
                    <p className="text-sm text-textGray">
                      نفهم متطلباتك وأهدافك بدقة
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="font-semibold text-textDark mb-2">حلول مخصصة</h3>
                    <p className="text-sm text-textGray">
                      نقدم حلول تناسب أعمالك
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="font-semibold text-textDark mb-2">خطة تنفيذ</h3>
                    <p className="text-sm text-textGray">
                      نضع خطة عمل واضحة ومفصلة
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-16">
              <div className="card">
                <h2 className="text-2xl font-bold text-textDark mb-6 text-center">أسئلة شائعة</h2>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-textDark mb-2">كم تستغرق الاستشارة؟</h3>
                    <p className="text-textGray">الاستشارة تستغرق 15-30 دقيقة حسب تعقيد المشروع.</p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-textDark mb-2">هل الاستشارة مجانية؟</h3>
                    <p className="text-textGray">نعم، الاستشارة الأولية مجانية تماماً.</p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-textDark mb-2">ماذا أحتاج للاستشارة؟</h3>
                    <p className="text-textGray">فكرة عامة عن مشروعك وأهدافك، ويمكن أن تكون مجرد فكرة أولية.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-textDark mb-2">هل يمكن إعادة جدولة الموعد؟</h3>
                    <p className="text-textGray">نعم، يمكنك إعادة جدولة الموعد في أي وقت قبل 24 ساعة من الموعد المحدد.</p>
                  </div>
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
