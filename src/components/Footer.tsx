import Link from 'next/link';
import { SITE } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-textDark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">{SITE.brandAr}</h3>
            <p className="text-gray-300 mb-4">
              نحن فريق يقدم حلول ذكاء اصطناعي عملية للأعمال، مع خدمة أساسية هي "البوت الذكي للماسنجر" 
              لربط صفحتك بعميلك فورًا.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 {SITE.address}</p>
              <p>📞 {SITE.phone}</p>
              <p>✉️ {SITE.emailPrimary}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-primary transition-colors">خدماتنا</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-primary transition-colors">تواصل معنا</Link></li>
              <li><Link href="/book" className="text-gray-300 hover:text-primary transition-colors">احجز ميتنغ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط قانونية</h4>
            <ul className="space-y-2">
              <li><a href={SITE.legal.privacyUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">سياسة الخصوصية</a></li>
              <li><a href={SITE.legal.termsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">الشروط والأحكام</a></li>
              <li><a href={SITE.legal.deletionUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">حذف البيانات</a></li>
            </ul>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
            نلتزم بسياسة نافذة 24 ساعة لرسائل الماسنجر واستخدام الوسوم المصرح بها من Meta.
          </p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {SITE.brandAr}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
