import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'حلول الذكاء الاصطناعي في الوطن العربي | إيجي أفريكا',
  description: 'حلول ذكاء اصطناعي متكاملة + تسويق إلكتروني وميديا وUGC. نخدم مصر والسعودية والخليج.',
  keywords: 'ذكاء اصطناعي، بوت ماسنجر، تسويق إلكتروني، مونتاج، جرافيك، تصوير، UGC، مصر، السعودية، الخليج',
  authors: [{ name: 'EKRAMY FOUAAD' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
      openGraph: {
      title: 'حلول الذكاء الاصطناعي في الوطن العربي | إيجي أفريكا',
      description: 'حلول ذكاء اصطناعي متكاملة + تسويق إلكتروني وميديا وUGC. نخدم مصر والسعودية والخليج.',
    type: 'website',
    locale: 'ar_AR',
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
