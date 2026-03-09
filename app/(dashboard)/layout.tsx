'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth, AuthProvider } from '@/contexts/auth-context'
import { db } from '@/lib/firebase' 
import { doc, onSnapshot } from 'firebase/firestore' 
import { Button } from '@/components/ui/button'
import { Gift, Wallet, User, LogOut, Menu, X, Shield, DollarSign, Handshake, Rocket } from 'lucide-react'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [livePoints, setLivePoints] = useState<number>(0)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && userData?.isBanned) router.push('/banned')
    if (userData) setLivePoints(userData.points || 0)

    if (user?.uid) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) setLivePoints(doc.data().points || 0)
      });
      return () => unsub();
    }
  }, [user, userData, loading, router])

  if (loading) return null

  const isAdmin = userData?.role === 'admin' || userData?.isAdmin === true

  const menuItems = [
    { name: 'Earn', icon: DollarSign, href: '/earn' },
    { name: 'Offers', icon: Rocket, href: '/offers' },
    { name: 'Partners', icon: Handshake, href: '/partners' },
    { name: 'Cashout', icon: Wallet, href: '/withdraw' },
    { name: 'Profile', icon: User, href: '/account' },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-[60] h-14 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:bg-white/5">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/earn" className="flex items-center">
             <span className="font-black text-xl tracking-tighter italic ml-2">Mr. <span className="text-[#10b981]">CASH</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-sm font-bold text-[#10b981]">{livePoints.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-[#0a0a0a] z-[80] border-r border-white/5 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
               <span className="font-black text-2xl italic">Mr. <span className="text-[#10b981]">CASH</span></span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-gray-500">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-[#10b981]/10 text-[#10b981]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon className={`w-5 h-5 ${active ? 'text-[#10b981]' : ''}`} />
                  {item.name}
                </Link>
              )
            })}
            {isAdmin && (
              <Link href="/admin" onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-red-500 transition-all ${pathname === '/admin' ? 'bg-red-500/10' : 'hover:bg-red-500/5'}`}>
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-4">Legal</div>
            <Link href="/terms" className="flex items-center gap-4 px-4 py-2 text-xs text-gray-400 font-bold hover:text-white">
               Terms & Conditions
            </Link>
            <Button onClick={() => { logout(); router.push('/login'); }} className="w-full justify-start gap-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors bg-transparent">
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* التعديل المهم هنا: pb-24 للجوال فقط و md:pb-2 للكمبيوتر */}
      <main className="pb-24 md:pb-2 pt-2 px-4">
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  )
}
