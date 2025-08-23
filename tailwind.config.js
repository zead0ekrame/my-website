/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // الألوان السعودية المطلوبة
        background: '#FAFAF7',
        primary: '#2EA69A',      // فيروزي/زمردي هادئ
        secondary: '#C8A24A',    // ذهبي باهت
        textDark: '#1E1E1E',     // نص داكن
        textGray: '#6B7280',     // رمادي
      },
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      direction: {
        'rtl': 'rtl',
      }
    },
  },
  plugins: [],
}
