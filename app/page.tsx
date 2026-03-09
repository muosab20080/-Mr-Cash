'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DollarSign,
  Gift,
  Wallet,
  Users,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: Gift,
    title: 'Complete Offers',
    description: 'Earn points by completing surveys, offers, and tasks from top brands.'
  },
  {
    icon: Wallet,
    title: 'Instant Payouts',
    description: 'Withdraw your earnings via PayPal, Payeer, Bitcoin, and more.'
  },
  {
    icon: Users,
    title: 'Referral Program',
    description: 'Earn 10% of your referrals earnings forever. Build passive income.'
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Your data is encrypted and payments are guaranteed. Over $1M paid out.'
  }
]

const stats = [
  { value: '$1.2M+', label: 'Paid Out' },
  { value: '50K+', label: 'Members' },
  { value: '100+', label: 'Offers Daily' },
  { value: '4.9/5', label: 'User Rating' }
]

const payoutMethods = ['PayPal', 'Bitcoin', 'Ethereum', 'Payeer', 'USDT']

export default function LandingPage() {
  const [tickerPayouts, setTickerPayouts] = useState([
    { name: 'Alex M.', amount: '25.00', method: 'PayPal' },
    { name: 'Sarah K.', amount: '50.00', method: 'Bitcoin' },
    { name: 'Mike J.', amount: '15.00', method: 'Payeer' },
    { name: 'Emma R.', amount: '100.00', method: 'Ethereum' },
    { name: 'Chris L.', amount: '35.00', method: 'USDT' }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Alex M.', 'Sarah K.', 'Mike J.', 'Emma R.', 'Chris L.', 'Jessica P.', 'David W.', 'Amanda S.']
      const newPayout = {
        name: names[Math.floor(Math.random() * names.length)],
        amount: (Math.random() * 95 + 5).toFixed(2),
        method: payoutMethods[Math.floor(Math.random() * payoutMethods.length)]
      }
      setTickerPayouts(prev => [...prev.slice(1), newPayout])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Live Payouts Ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 overflow-hidden">
        <div className="animate-ticker flex h-full items-center gap-8 whitespace-nowrap">
          {tickerPayouts.concat(tickerPayouts).map((payout, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <DollarSign className="h-3 w-3 text-primary" />
              <span className="text-primary font-medium">{payout.name}</span>
              <span className="text-muted-foreground">withdrew</span>
              <span className="text-primary font-bold">${payout.amount}</span>
              <span className="text-muted-foreground">via</span>
              <span className="text-foreground">{payout.method}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <header className="fixed top-8 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Mr. Cash</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Join 50,000+ members earning daily</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Earn Money
              <span className="text-primary block">Completing Tasks</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Complete simple offers, surveys, and tasks to earn real cash. 
              Withdraw instantly via PayPal, Crypto, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] transition-all">
                  Start Earning Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border/50 hover:border-primary/50 hover:bg-primary/5">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Mr. Cash</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer the best rates, fastest payouts, and most trusted platform for earning money online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] group"
              >
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground">Start earning in just 3 simple steps</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up for free in less than 30 seconds' },
              { step: 2, title: 'Complete Offers', desc: 'Choose from hundreds of available tasks' },
              { step: 3, title: 'Get Paid', desc: 'Withdraw your earnings instantly' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Our <span className="text-primary">Members</span> Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Alex M.', text: 'Made $500 in my first month! The offers are easy and payouts are instant.', earned: '$2,450' },
              { name: 'Sarah K.', text: 'Best GPT site I have ever used. The referral program is amazing!', earned: '$5,120' },
              { name: 'Mike J.', text: 'Fast payouts and great customer support. Highly recommended!', earned: '$1,890' }
            ].map((testimonial) => (
              <Card key={testimonial.name} className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{`"${testimonial.text}"`}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {testimonial.name[0]}
                      </div>
                      <span className="font-medium text-foreground">{testimonial.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">{testimonial.earned}</p>
                      <p className="text-xs text-muted-foreground">earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Ready to Start <span className="text-primary">Earning</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of members who are already earning money with Mr. Cash. 
                Sign up now and get a $0.50 welcome bonus!
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(57,255,20,0.4)]">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" /> Free to join
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" /> No minimum payout
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" /> Instant withdrawals
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">Mr. Cash</span>
            </div>
            <p className="text-muted-foreground text-sm">
              2024 Mr. Cash. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  )
}
