import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Privacy Meta - منصة الذكاء الاصطناعي الآمنة',
  description: 'منصة ذكاء اصطناعي متقدمة مع التركيز على الخصوصية والأمان. واجهة دردشة ذكية مع حماية متقدمة للبيانات.',
  keywords: 'ذكاء اصطناعي، خصوصية، أمان، chatbot، AI، حماية البيانات، منصة آمنة',
  authors: [{ name: 'Privacy Meta Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'Privacy Meta - منصة الذكاء الاصطناعي الآمنة',
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#764ba2" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({ xfbml: true, version: 'v19.0', appId: 'APP_ID_HERE' });
              };
            `,
          }}
        />
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/ar_AR/sdk/xfbml.customerchat.js"
        />
      </head>
      <body className="font-tajawal">
        <div id="fb-root"></div>
        <div
          className="fb-customerchat"
          data-attribution="setup_tool"
          data-page_id="PAGE_ID_HERE"
          data-theme_color="#2EA69A"
          data-logged_in_greeting="أهلاً! كيف نساعدك؟"
          data-logged_out_greeting="مرحباً! ابدأ المحادثة معنا."
        ></div>
        {children}
      </body>
    </html>
  )
}
