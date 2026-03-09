'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { collection, query, where, orderBy, onSnapshot, limit, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  User, Mail, Lock, Copy, Check, Gift, TrendingUp, Users, 
  Edit, Save, X, Settings, Wallet, Clock, CheckCircle, XCircle, Loader2 
} from 'lucide-react'

interface Offer { 
  id: string; 
  offerName: string; 
  wallName: string; 
  points: number; 
  createdAt: any 
}

interface Withdrawal { 
  id: string; 
  amount: number; 
  method: string; 
  status: 'pending' | 'approved' | 'rejected'; 
  createdAt: any 
}

export default function AccountPage() {
  const { userData, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'history' ? 'offers' : 'settings'
  
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [editing, setEditing] = useState<'name' | 'email' | 'password' | null>(null)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [offers, setOffers] = useState<Offer[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userData) return

    // جلب العروض لحظياً - بدون Limit لضمان ثبات السجل الكامل
    const qOffers = query(
      collection(db, 'offers_completed'), 
      where('userId', '==', userData.uid), 
      orderBy('createdAt', 'desc')
    )
    const unsubOffers = onSnapshot(qOffers, (snap) => {
      setOffers(snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(), 
        createdAt: doc.data().createdAt?.toDate() || new Date() 
      })) as any)
    })

    // جلب السحوبات لحظياً - تشمل (Pending, Approved, Rejected) لضمان عدم اختفائها
    const qWithdrawals = query(
      collection(db, 'withdrawals'), 
      where('userId', '==', userData.uid), 
      orderBy('createdAt', 'desc')
    )
    const unsubWithdrawals = onSnapshot(qWithdrawals, (snap) => {
      setWithdrawals(snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(), 
        createdAt: doc.data().createdAt?.toDate() || new Date() 
      })) as any)
      setLoading(false)
    })

    return () => { unsubOffers(); unsubWithdrawals(); }
  }, [userData])

  if (!userData) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${userData.uid}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true); setError('')
    try {
      await updateUserProfile(newName.trim())
      setSuccess('Username updated!'); setEditing(null); setNewName('')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to update username') }
    setSaving(false)
  }

  const handleSaveEmail = async () => {
    if (!newEmail.trim()) return
    setSaving(true); setError('')
    try {
      await updateUserEmail(newEmail.trim())
      setSuccess('Email updated!'); setEditing(null); setNewEmail('')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to update email') }
    setSaving(false)
  }

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setSaving(true); setError('')
    try {
      await updateUserPassword(newPassword)
      setSuccess('Password updated!'); setEditing(null); setNewPassword(''); setConfirmPassword('')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to update password') }
    setSaving(false)
  }

  const cancelEdit = () => { setEditing(null); setNewName(''); setNewEmail(''); setNewPassword(''); setConfirmPassword(''); setError('') }

  const stats = [
    { label: 'Points', value: userData.points?.toLocaleString() || '0', icon: Gift },
    { label: 'Earned', value: `$${((userData.points || 0) / 1000).toFixed(2)}`, icon: TrendingUp },
    { label: 'Referrals', value: userData.referrals || '0', icon: Users }
  ]

  const statusConfig = {
    pending: { icon: Clock, class: 'bg-amber-500/20 text-amber-400', label: 'Pending' },
    approved: { icon: CheckCircle, class: 'bg-primary/20 text-primary', label: 'Completed' },
    rejected: { icon: XCircle, class: 'bg-destructive/20 text-destructive', label: 'Rejected' }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account</h1>
        <p className="text-sm text-muted-foreground">Manage your settings and view activity</p>
      </div>

      {success && <div className="p-3 rounded-lg bg-primary/10 text-primary text-sm">{success}</div>}
      {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {/* Profile Card */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {userData.displayName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{userData.displayName}</h2>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-2 rounded-lg bg-secondary/50">
                  <stat.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-sm font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto bg-secondary/50 border border-border/50 p-1">
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-1.5" /> Settings
          </TabsTrigger>
          <TabsTrigger value="offers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gift className="h-4 w-4 mr-1.5" /> History
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wallet className="h-4 w-4 mr-1.5" /> Withdrawals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-4 space-y-4">
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account Settings</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-foreground"><User className="h-4 w-4 text-muted-foreground" /> Username</Label>
                {editing === 'name' ? (
                  <div className="flex gap-2">
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New username" className="bg-secondary/50 border-border/50" />
                    <Button onClick={handleSaveName} disabled={saving} size="icon"><Save className="h-4 w-4" /></Button>
                    <Button onClick={cancelEdit} variant="outline" size="icon"><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <span className="text-foreground font-medium">{userData.displayName}</span>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing('name'); setNewName(userData.displayName || '') }} className="text-primary hover:bg-primary/10"><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-foreground"><Lock className="h-4 w-4 text-muted-foreground" /> Change Password</Label>
                {editing === 'password' ? (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" title="At least 6 characters" />
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
                    <div className="flex gap-2">
                      <Button onClick={handleSavePassword} disabled={saving} className="bg-primary"><Save className="h-4 w-4 mr-2" /> Update</Button>
                      <Button onClick={cancelEdit} variant="outline">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                    <span className="text-muted-foreground font-mono">••••••••</span>
                    <Button variant="ghost" size="sm" onClick={() => setEditing('password')} className="text-primary hover:bg-primary/10"><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Referral Program</CardTitle>
              <CardDescription>Earn 10% commission from your friends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input readOnly value={`${window.location.origin}/register?ref=${userData.uid}`} className="font-mono text-sm bg-background border-primary/20" />
                <Button onClick={handleCopy} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-4">
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Offer History</CardTitle>
            </CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                   <Gift className="h-8 w-8 mb-2" />
                   <p>No offers completed yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {offers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50 transition-colors hover:bg-secondary/70">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Gift className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{offer.offerName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{offer.wallName}</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary">+{offer.points.toLocaleString()} pts</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-4">
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawals.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                  <Wallet className="h-8 w-8 mb-2" />
                  <p>No withdrawals yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {withdrawals.map((w) => {
                    const config = statusConfig[w.status as keyof typeof statusConfig] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <div key={w.id} className={`flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50 transition-all ${w.status === 'rejected' ? 'opacity-90' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${w.status === 'approved' ? 'bg-primary/10' : w.status === 'rejected' ? 'bg-destructive/10' : 'bg-amber-500/10'}`}>
                            <Wallet className={`h-4 w-4 ${w.status === 'approved' ? 'text-primary' : w.status === 'rejected' ? 'text-destructive' : 'text-amber-500'}`} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">${w.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{w.method}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`${config.class} border-none text-[10px] py-0 px-2`}>
                            <StatusIcon className="h-3 w-3 mr-1" /> {config.label}
                          </Badge>
                          <p className="text-[9px] text-muted-foreground">
                            {w.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
