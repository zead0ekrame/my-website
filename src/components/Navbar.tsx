'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SITE } from '../lib/constants';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              {SITE.brandAr}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 space-x-reverse">
              <Link href="/" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                الرئيسية
              </Link>
              <Link href="/services" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                خدماتنا
              </Link>
              <Link href="/contact" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                تواصل معنا
              </Link>
              <Link href="/book" className="text-textDark hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                احجز ميتنغ
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/contact" className="btn-primary">
              ابدأ الآن
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-textDark hover:text-primary focus:outline-none focus:text-primary"
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
            <div className="pt-4">
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
