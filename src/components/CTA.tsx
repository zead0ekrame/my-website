import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          جاهز تبدأ؟ احجز استشارة خلال 15 دقيقة
        </h2>
        <p className="text-xl mb-8 opacity-90">
          دعنا نناقش احتياجاتك ونقدم لك الحلول المناسبة
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book" className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            احجز الآن
          </Link>
          <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-colors">
            تواصل معنا
          </Link>
        </div>
      </div>
    </section>
  );
}
