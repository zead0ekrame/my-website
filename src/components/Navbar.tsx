'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SITE } from '../lib/constants';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary">
              {SITE.brandAr}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 space-x-reverse">
              <Link href="/" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg">
                الرئيسية
              </Link>
              <Link href="/services" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg">
                خدماتنا
              </Link>
              <Link href="/contact" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg">
                تواصل معنا
              </Link>
              <Link href="/book" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-50 rounded-lg">
                احجز ميتنغ
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-sm text-textDark hover:text-primary rounded-lg hover:bg-slate-50 transition-colors">
                تسجيل الدخول
              </Link>
              <Link href="/contact" className="btn-primary">
                ابدأ الآن
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-textDark hover:text-primary focus:outline-none focus:text-primary p-2 rounded-lg hover:bg-slate-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/" className="text-textDark hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              الرئيسية
            </Link>
            <Link href="/services" className="text-textDark hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              خدماتنا
            </Link>
            <Link href="/contact" className="text-textDark hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              تواصل معنا
            </Link>
            <Link href="/book" className="text-textDark hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              احجز ميتنغ
            </Link>
            <div className="pt-4 space-y-2">
              <Link href="/login" className="block w-full text-center px-3 py-2 rounded-md border text-textDark hover:text-primary">
                تسجيل الدخول
              </Link>
              <Link href="/contact" className="btn-primary w-full text-center block">
                ابدأ الآن
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
