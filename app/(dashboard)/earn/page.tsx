'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Zap, LayoutGrid, Star, Play, TrendingUp } from 'lucide-react'

const offerwalls = [
  { 
    id: 'gemiad', 
    name: 'GemiAd', 
    category: 'offers',
    multiplier: 1.5, 
    payout: 'Earn up to 250$ every day', 
    logo: 'https://gemiad.s3.eu-central-1.amazonaws.com/logos/Asset_1.png', 
    isFeatured: true,
    url: 'https://gemiwall.com?placementId=6977536ec6ceefce12a28330' 
  },
  { 
    id: 'playtime', 
    name: 'PlayTimeAds', 
    category: 'offers',
    multiplier: 7.0, 
    payout: 'SIMPLE, FAST, REAL', 
    logo: 'https://earng.net/storage/providers/zeG92gZZxlLyVw6nTwvBWeFN4eV6l1Lqy90xQzHZ.webp', 
    isFeatured: true,
    url: 'https://web.playtimeads.com/index.php?app_id=6d186de0e9e5e8d7'
  },
  { id: 'dtowall', name: 'dtowall', category: 'offers', multiplier: 1.2, payout: 'High Payouts', isFeatured: false, logo: 'DW', color: 'bg-emerald-500', url: '#' },
];

export default function EarnPage() {
  const { userData } = useAuth()
  const [search, setSearch] = useState('')

  if (!userData) return null

  const openWall = (wall) => {
    if (!wall.url || wall.url === '#') return;
    let finalUrl = wall.url;
    const userId = userData.uid || userData.id;

    if (wall.id === 'gemiad') finalUrl = `${wall.url}&userId=${userId}`;
    else if (wall.id === 'playtime') finalUrl = `${wall.url}&user_id=${userId}`;

    window.open(finalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-8 pb-32">
      
      {/* قسم الشركاء المميزين (Featured Partners) - نفس شكل الصورة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-500 font-bold text-lg">
          <TrendingUp className="w-5 h-5" />
          <h2>Featured Partners</h2>
        </div>

        <div className="grid gap-4">
          {offerwalls.filter(w => w.isFeatured).map((wall) => (
            <div 
              key={wall.id}
              onClick={() => openWall(wall)}
              className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-950/20 to-black p-6 group cursor-pointer transition-all hover:border-green-500/50"
            >
              <div className="absolute top-4 right-4 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1">
                TRENDIFY 🔥
              </div>
              
              <div className="flex flex-col gap-4">
                <img src={wall.logo} alt={wall.name} className="h-10 w-fit object-contain brightness-125" />
                <div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase italic">START EARN</h3>
                  <p className="text-gray-400 text-sm font-medium">{wall.payout}</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-green-500 p-3 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-black fill-current" />
              </div>
              
              {/* تأثير الإضاءة في الخلفية */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-500/10 blur-[50px]" />
            </div>
          ))}
        </div>
      </div>

      {/* قسم شركاء العروض (Offer Partners) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-500 font-bold text-lg">
          <LayoutGrid className="w-5 h-5" />
          <h2>Offer Partners</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {offerwalls.map((wall) => (
            <div 
              key={wall.id}
              onClick={() => openWall(wall)}
              className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="relative">
                 <img src={wall.logo} alt={wall.name} className="w-12 h-12 rounded-xl object-contain bg-white/5 p-2" />
                 <Badge className="absolute -top-2 -right-2 bg-purple-600 text-[8px] px-1 py-0">Trendify 🔥</Badge>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold truncate">{wall.name}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
