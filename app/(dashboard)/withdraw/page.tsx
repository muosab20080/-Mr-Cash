'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
// تم إضافة updateDoc و doc و increment لخصم النقاط برمجياً
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// تم إضافة Badge هنا لحل مشكلة 'Badge is not defined'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Wallet, DollarSign, Bitcoin, CheckCircle, AlertCircle, CreditCard, Coins, Loader2 } from 'lucide-react'

const methods = [
  { id: 'paypal', name: 'PayPal', icon: CreditCard, min: 5, time: '24-48h', color: 'bg-blue-500', placeholder: 'PayPal email' },
  { id: 'payeer', name: 'Payeer', icon: Wallet, min: 3, time: '12-24h', color: 'bg-cyan-500', placeholder: 'Payeer ID (P1234567)' },
  { id: 'bitcoin', name: 'Bitcoin', icon: Bitcoin, min: 10, time: '1-6h', color: 'bg-orange-500', placeholder: 'BTC address' },
  { id: 'ethereum', name: 'Ethereum', icon: Coins, min: 10, time: '1-6h', color: 'bg-indigo-500', placeholder: 'ETH address' },
  { id: 'usdt', name: 'USDT TRC20', icon: DollarSign, min: 10, time: '1-6h', color: 'bg-emerald-500', placeholder: 'TRC20 address' },
  { id: 'litecoin', name: 'Litecoin', icon: Coins, min: 5, time: '1-3h', color: 'bg-slate-500', placeholder: 'LTC address' },
]

export default function WithdrawPage() {
  const { userData } = useAuth()
  const [selected, setSelected] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!userData) return null

  // التأكد من وجود قيمة للنقاط لتجنب أخطاء الحساب
  const currentPoints = userData.points || 0
  const balance = currentPoints / 1000
  const method = methods.find(m => m.id === selected)
  const withdrawAmount = parseFloat(amount) || 0
  const canWithdraw = method && withdrawAmount >= method.min && withdrawAmount <= balance && address.trim()

  const handleSubmit = async () => {
    if (!canWithdraw || !method) return
    setSubmitting(true)
    setError('')
    try {
      // 1. حساب النقاط المطلوب خصمها
      const pointsToDeduct = withdrawAmount * 1000

      // 2. تحديث رصيد المستخدم (خصم النقاط)
      const userRef = doc(db, 'users', userData.uid)
      await updateDoc(userRef, {
        points: increment(-pointsToDeduct)
      })

      // 3. تسجيل الطلب في مجموعة 'withdrawals' (الاسم الموحد للسجل)
      await addDoc(collection(db, 'withdrawals'), {
        userId: userData.uid,
        userEmail: userData.email,
        userName: userData.displayName,
        amount: withdrawAmount,
        method: method.name,
        walletAddress: address.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      })

      setSuccess(true)
      setShowConfirm(false)
    } catch (err) {
      console.error("Withdrawal Error:", err)
      setError('Failed to submit request. Please check your connection.')
    }
    setSubmitting(false)
  }

  const reset = () => {
    setSuccess(false)
    setAmount('')
    setAddress('')
    setSelected(null)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Withdrawal Submitted</h2>
            <p className="text-sm text-muted-foreground mb-6">
              ${withdrawAmount.toFixed(2)} via {method?.name}. <br />
              Estimated time: {method?.time}
            </p>
            <Button onClick={reset} className="w-full bg-primary text-primary-foreground">
              New Withdrawal
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdraw</h1>
          <p className="text-sm text-muted-foreground">Cash out your earnings</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
          <Wallet className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Available</p>
            <p className="text-lg font-bold text-primary leading-none">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Payment Methods */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Payment Method</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {methods.map((m) => {
            const isSelected = selected === m.id
            const canAfford = balance >= m.min
            return (
              <button
                key={m.id}
                onClick={() => canAfford && setSelected(m.id)}
                disabled={!canAfford}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : canAfford ? 'border-border/50 bg-secondary/20 hover:border-primary/50' : 'border-border/30 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className={`h-8 w-8 rounded-lg ${m.color} flex items-center justify-center text-white mb-2 shadow-sm`}>
                  <m.icon className="h-4 w-4" />
                </div>
                <p className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>{m.name}</p>
                <p className="text-[10px] text-muted-foreground">Min: ${m.min}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Form Section */}
      {selected && method && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
          <CardHeader className="pb-3 border-b border-border/50 mb-4">
            <CardTitle className="text-base text-foreground">Withdrawal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: $${method.min}`}
                  className="pl-9 bg-secondary/30"
                  min={method.min}
                  max={balance}
                />
              </div>
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-muted-foreground">Limit: ${method.min} - ${balance.toFixed(2)}</span>
                <button onClick={() => setAmount(balance.toFixed(2))} className="text-primary hover:underline">
                  Max: ${balance.toFixed(2)}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground">{method.name} Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={method.placeholder}
                className="bg-secondary/30 font-mono text-sm"
              />
            </div>

            {withdrawAmount > 0 && (
              <div className="p-3 rounded-lg bg-secondary/50 space-y-1 text-xs border border-border/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange</span>
                  <span className="text-foreground font-medium">{(withdrawAmount * 1000).toLocaleString()} points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div className="border-t border-border/50 pt-1 flex justify-between font-bold text-sm">
                  <span className="text-foreground">You Receive</span>
                  <span className="text-primary">${withdrawAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!canWithdraw}
              className="w-full h-11 bg-primary text-primary-foreground font-bold transition-transform active:scale-95"
            >
              Withdraw ${withdrawAmount.toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Payout</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg text-primary">${withdrawAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between px-1">
              <span className="text-muted-foreground">Method</span>
              <Badge variant="outline" className="bg-primary/5">{method?.name}</Badge>
            </div>
            <div className="flex justify-between px-1">
              <span className="text-muted-foreground">To</span>
              <span className="font-mono text-[11px] truncate max-w-[150px]">{address}</span>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-primary flex-1">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Confirm Withdrawal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
