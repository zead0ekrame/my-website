import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Website - منصة الذكاء الاصطناعي الآمنة',
  description: 'منصة ذكاء اصطناعي متقدمة مع التركيز على الخصوصية والأمان. واجهة دردشة ذكية مع حماية متقدمة للبيانات.',
  keywords: 'ذكاء اصطناعي، خصوصية، أمان، chatbot، AI، حماية البيانات، منصة آمنة',
  authors: [{ name: 'My Website Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'My Website - منصة الذكاء الاصطناعي الآمنة',
    description: 'منصة ذكاء اصطناعي متقدمة مع التركيز على الخصوصية والأمان',
    type: 'website',
    locale: 'ar_AR',
    images: ['/icon.svg'],
  },
}

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
