import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import BottomNav from '../components/BottomNav' 
import { AuthProvider } from '@/contexts/auth-context' // تأكد من استيراد الـ Provider

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
        
        {/* تغليف الموقع بالكامل بـ AuthProvider هو الحل لفشل الـ Build */}
        <AuthProvider>
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-600/5 blur-[120px]" />
          </div>

          <main className="relative min-h-screen pb-32 md:pb-0">
            {children}
          </main>

          <BottomNav />
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}
