import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'حلول تقنية متقدمة - منصة الذكاء الاصطناعي',
  description: 'منصة ذكاء اصطناعي متقدمة مع التركيز على الخصوصية والأمان. واجهة دردشة ذكية مع حماية متقدمة للبيانات.',
  authors: [{ name: 'حلول تقنية متقدمة' }],
  keywords: ['ذكاء اصطناعي', 'خصوصية', 'أمان', 'chatbot', 'AI', 'حماية البيانات', 'منصة آمنة'],
  openGraph: {
    title: 'حلول تقنية متقدمة - منصة الذكاء الاصطناعي',
    description: 'منصة ذكاء اصطناعي متقدمة مع التركيز على الخصوصية والأمان',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'حلول تقنية متقدمة'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'حلول تقنية متقدمة - منصة الذكاء الاصطناعي',
    description: 'منصة ذكاء اصطناعي متقدمة مع التركيز على الخصوصية والأمان',
    images: ['/icon.svg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-tajawal">
        {children}
      </body>
    </html>
  )
}
