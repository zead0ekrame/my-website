import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'حلول ذكاء اصطناعي وبوت ماسنجر | إيجي أفريكا',
    template: '%s | إيجي أفريكا'
  },
  description: 'خدمة البوت الذكي كخدمة أساسية + تسويق إلكتروني وميديا وUGC. نخدم مصر والسعودية والخليج.',
  keywords: [
    'ذكاء اصطناعي',
    'بوت ماسنجر',
    'تسويق إلكتروني',
    'مونتاج',
    'جرافيك',
    'تصوير',
    'UGC',
    'مصر',
    'السعودية',
    'الخليج',
    'إيجي أفريكا',
    'خدمات رقمية',
    'بوت ذكي',
    'ميتا',
    'فيسبوك'
  ],
  authors: [{ name: 'EKRAMY FOUAAD' }],
  creator: 'EKRAMY FOUAAD',
  publisher: 'إيجي أفريكا',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ekramy-ai.online'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: 'https://ekramy-ai.online',
    title: 'حلول ذكاء اصطناعي وبوت ماسنجر | إيجي أفريكا',
    description: 'خدمة البوت الذكي كخدمة أساسية + تسويق إلكتروني وميديا وUGC. نخدم مصر والسعودية والخليج.',
    siteName: 'إيجي أفريكا',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'إيجي أفريكا - حلول ذكاء اصطناعي وبوت ماسنجر',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'حلول ذكاء اصطناعي وبوت ماسنجر | إيجي أفريكا',
    description: 'خدمة البوت الذكي كخدمة أساسية + تسويق إلكتروني وميديا وUGC. نخدم مصر والسعودية والخليج.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
  },
};

export function generateMetadata(
  title?: string,
  description?: string,
  path?: string
): Metadata {
  return {
    ...defaultMetadata,
    title: title ? `${title} | إيجي إفريقيا للمقاولات` : defaultMetadata.title,
    description: description || defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title ? `${title} | إيجي إفريقيا للمقاولات` : defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      url: path ? `https://ekramy-ai.online${path}` : defaultMetadata.openGraph?.url,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title ? `${title} | إيجي إفريقيا للمقاولات` : defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
    },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "إيجي أفريكا",
  "alternateName": "Egy Africa",
  "url": "https://ekramy-ai.online",
  "logo": "https://ekramy-ai.online/logo.svg",
  "email": "ziad@ekramy-ai.online",
  "telephone": "+201066161454",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "EG",
    "addressLocality": "Alexandria",
    "addressRegion": "Al Amreya",
    "streetAddress": "خلف قرية هاني",
    "postalCode": ""
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+201066161454",
    "contactType": "customer service",
    "areaServed": ["EG", "SA", "AE", "KW", "BH", "OM", "QA"],
    "availableLanguage": ["Arabic", "English"]
  },
  "sameAs": [],
  "foundingDate": "2024",
  "description": "شركة تقدم حلول ذكاء اصطناعي وبوت ماسنجر، إلى جانب خدمات التسويق الإلكتروني والميديا والتصميم",
  "areaServed": [
    {
      "@type": "Country",
      "name": "مصر"
    },
    {
      "@type": "Country", 
      "name": "السعودية"
    },
    {
      "@type": "Country",
      "name": "الإمارات"
    }
  ],
  "serviceType": [
    "بوت ماسنجر بالذكاء الاصطناعي",
    "التسويق الإلكتروني", 
    "ميديا ومونتاج وفيديوهات",
    "تصميم جرافيك وهوية",
    "تصوير فوتوغرافي & UGC",
    "حلول الذكاء الاصطناعي للأعمال"
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "إيجي أفريكا",
  "image": "https://ekramy-ai.online/logo.svg",
  "description": "شركة تقدم حلول ذكاء اصطناعي وبوت ماسنجر",
  "url": "https://ekramy-ai.online",
  "telephone": "+201066161454",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "EG",
    "addressLocality": "Alexandria",
    "addressRegion": "Al Amreya",
    "streetAddress": "خلف قرية هاني"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 31.2001,
    "longitude": 29.9187
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday", 
      "Wednesday",
      "Thursday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "priceRange": "$$",
  "currenciesAccepted": "EGP, USD, SAR, AED"
};
