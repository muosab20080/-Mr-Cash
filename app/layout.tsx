import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
// استدعاء الشريط السفلي الجديد
import BottomNav from '../components/BottomNav' 

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Mr. Cash - Earn Money Completing Tasks',
  description: 'Complete simple offers, surveys, and tasks to earn real cash. Withdraw instantly via PayPal, Crypto, and more.',
  generator: 'Mr. Cash',
  verification: {
    google: 'QBNLNukBNtx83WdFh_hXeoZ4rS1Sj11Q9aQbpOcQwcs', 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#000000] text-white selection:bg-green-500/30 overflow-x-hidden`}>
        
        {/* تأثير الـ Glassmorphism الأخضر في الخلفية */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-600/5 blur-[120px]" />
        </div>

        {/* التعديل: pb-32 للجوال فقط، و md:pb-0 للكمبيوتر لضمان عدم وجود فراغ زائد */}
        <main className="relative min-h-screen pb-32 md:pb-0">
          {children}
        </main>

        {/* تفعيل الشريط السفلي العائم هنا ليعمل في كل الموقع */}
        <BottomNav />

        <Analytics />
      </body>
    </html>
  )
}
