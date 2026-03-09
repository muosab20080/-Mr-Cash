'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { collection, getDocs, doc, updateDoc, query, orderBy, limit, increment, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import {
  Users,
  DollarSign,
  Ban,
  Edit,
  CheckCircle,
  XCircle,
  Search,
  Shield,
  RefreshCw,
  Clock,
  Copy,
  History,
  Wallet
} from 'lucide-react'

// واجهات البيانات
interface UserRecord {
  uid: string; email: string; displayName: string; points: number;
  role: 'user' | 'admin'; isBanned: boolean; completedOffers: number;
}

interface PayoutRequest {
  id: string; userId: string; userEmail: string; userName: string;
  amount: number; method: string; status: 'pending' | 'approved' | 'rejected';
  createdAt: Date; walletAddress?: string;
}

export default function AdminPage() {
  const { userData, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [editPoints, setEditPoints] = useState('')

  // حماية الصفحة للأدمن فقط
  useEffect(() => {
    if (!loading && (!userData || userData.role !== 'admin')) {
      router.push('/earn')
    }
  }, [userData, loading, router])

  // مراقبة المستخدمين لحظياً للتوافق مع النقاط الجديدة
  useEffect(() => {
    if (userData?.role === 'admin') {
      const q = query(collection(db, 'users'), limit(100));
      const unsub = onSnapshot(q, (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as UserRecord)));
        setLoadingUsers(false);
      });

      const pq = query(collection(db, 'withdrawals'), orderBy('createdAt', 'desc'), limit(50));
      const unsubPayouts = onSnapshot(pq, (snapshot) => {
        setPayoutRequests(snapshot.docs.map(d => ({
          id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() || new Date()
        } as PayoutRequest)));
      });

      return () => { unsub(); unsubPayouts(); }
    }
  }, [userData])

  const handleBanUser = async (userId: string, ban: boolean) => {
    await updateDoc(doc(db, 'users', userId), { isBanned: ban });
  }

  const handleUpdatePoints = async () => {
    if (!editingUser) return;
    await updateDoc(doc(db, 'users', editingUser.uid), { points: parseInt(editPoints) });
    setEditingUser(null);
  }

  const handlePayoutAction = async (payout: PayoutRequest, action: 'approved' | 'rejected') => {
    await updateDoc(doc(db, 'withdrawals', payout.id), { status: action });
    if (action === 'rejected') {
      await updateDoc(doc(db, 'users', payout.userId), { points: increment(payout.amount * 1000) });
    }
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading || !userData || userData.role !== 'admin') return null;

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto pb-24">
      {/* Header الصغير للجوال */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#10b981]" /> Admin Panel
        </h1>
        <Badge className="bg-[#10b981] text-black">v2.0 Mobile</Badge>
      </div>

      {/* Stats - شبكة متجاوبة */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-[#0a0a0a] border-white/5 p-4">
          <Users className="h-4 w-4 text-[#10b981] mb-2" />
          <p className="text-xl font-black">{users.length}</p>
          <p className="text-[10px] text-gray-500 uppercase">Users</p>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/5 p-4">
          <DollarSign className="h-4 w-4 text-[#10b981] mb-2" />
          <p className="text-xl font-black truncate">{users.reduce((a, b) => a + (b.points || 0), 0).toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 uppercase">Total Points</p>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-2 bg-black border border-white/10 mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search..." 
              className="pl-9 bg-[#0a0a0a] border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div key={user.uid} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#10b981]/10 flex items-center justify-center font-bold text-[#10b981]">
                      {user.displayName?.[0] || 'U'}
                    </div>
                    <div className="max-w-[120px]">
                      <p className="font-bold text-sm truncate">{user.displayName || 'User'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[#10b981] font-black text-sm">{user.points}</span>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7 border border-white/10" onClick={() => { setEditingUser(user); setEditPoints(user.points.toString()); }}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black border-white/10 text-white w-[90%] rounded-2xl">
                          <DialogHeader><DialogTitle>Edit Points</DialogTitle></DialogHeader>
                          <Input type="number" value={editPoints} onChange={(e) => setEditPoints(e.target.value)} className="bg-white/5 border-white/10" />
                          <Button onClick={handleUpdatePoints} className="bg-[#10b981] text-black font-bold">Save</Button>
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" className={`h-7 w-7 border ${user.isBanned ? 'border-[#10b981] text-[#10b981]' : 'border-red-500/30 text-red-500'}`} onClick={() => handleBanUser(user.uid, !user.isBanned)}>
                        {user.isBanned ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="payouts">
          <ScrollArea className="h-[70vh]">
            <div className="space-y-3">
              {payoutRequests.map(payout => (
                <div key={payout.id} className={`p-4 rounded-2xl border ${payout.status === 'pending' ? 'bg-[#10b981]/5 border-[#10b981]/20' : 'bg-black border-white/5 opacity-70'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-sm">{payout.userName}</p>
                      <p className="text-[10px] text-gray-500">{payout.method}</p>
                    </div>
                    <p className="text-[#10b981] font-black">${payout.amount}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg mb-3 flex items-center justify-between">
                    <code className="text-[9px] text-gray-400 truncate w-[80%]">{payout.walletAddress}</code>
                    <Copy className="h-3 w-3 text-gray-500" onClick={() => navigator.clipboard.writeText(payout.walletAddress || '')} />
                  </div>
                  {payout.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <Button className="flex-1 bg-[#10b981] text-black text-xs font-bold h-8" onClick={() => handlePayoutAction(payout, 'approved')}>Approve</Button>
                      <Button variant="outline" className="flex-1 border-red-500 text-red-500 text-xs h-8" onClick={() => handlePayoutAction(payout, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
