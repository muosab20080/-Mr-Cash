// ... (الإستيرادات)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
        
        {/* التعديل المصيري: pb-32 للجوال فقط و md:pb-0 للكمبيوتر */}
        <main className="relative min-h-screen pb-32 md:pb-0">
          {children}
        </main>

        {/* استدعاء المكون الجديد */}
        <BottomNav />

        <Analytics />
      </body>
    </html>
  )
}
