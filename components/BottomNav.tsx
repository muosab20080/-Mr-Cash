"use client"
import { Wallet, UserPlus, CircleDollarSign, Gift, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context' // استيراد حالة تسجيل الدخول

const BottomNav = () => {
  const pathname = usePathname()
  const { user } = useAuth() // التأكد من وجود مستخدم

  // إذا لم يسجل المستخدم دخوله، لا تظهر الشريط أبداً
  if (!user) return null

  const navItems = [
    { name: 'Cashout', icon: Wallet, href: '/withdraw' },
    { name: 'Referrals', icon: UserPlus, href: '/referrals' },
    { name: 'Earn', icon: CircleDollarSign, href: '/earn', isMain: true },
    { name: 'Offers', icon: Gift, href: '/offers' },
    { name: 'Profile', icon: User, href: '/account' },
  ]

  return (
    /* md:hidden: يختفي الشريط تماماً في شاشات الكمبيوتر واللابتوب */
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-[100] md:hidden">
      <div className="relative flex items-center justify-between bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-[2.5rem] shadow-2xl">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href

          if (item.isMain) {
            return (
              <Link key={item.name} href={item.href} className="relative group">
                <div className={`absolute -top-14 left-1/2 -translate-x-1/2 p-4 rounded-full border-[6px] border-[#0a0a0a] transition-all duration-300 ${isActive ? 'bg-[#10b981] scale-110 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'bg-[#10b981] hover:scale-105'}`}>
                  <item.icon className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
                <span className={`mt-8 block text-[10px] text-center font-bold tracking-wide ${isActive ? 'text-[#10b981]' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </Link>
            )
          }

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 transition-transform active:scale-90">
              <item.icon 
                className={`w-5 h-5 transition-all ${isActive ? 'text-[#10b981] scale-110' : 'text-gray-500 group-hover:text-white'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[9px] font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
