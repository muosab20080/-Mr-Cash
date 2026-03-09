'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'

export interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  points: number
  lifetimeEarnings: number
  completedOffers: number
  referrals: number
  referralCode: string
  role: 'user' | 'admin'
  createdAt: Date | null
  isBanned: boolean
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  updateUserEmail: (newEmail: string) => Promise<void>
  updateUserPassword: (newPassword: string) => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const generateReferralCode = (uid: string) => {
    return `MRC${uid.substring(0, 8).toUpperCase()}`
  }

  const createUserDocument = async (user: User) => {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const newUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL,
        points: 0,
        lifetimeEarnings: 0,
        completedOffers: 0,
        referrals: 0,
        referralCode: generateReferralCode(user.uid),
        role: 'user' as const,
        createdAt: serverTimestamp(),
        isBanned: false
      }
      await setDoc(userRef, newUserData)
      return newUserData
    }
    return userSnap.data() as UserData
  }

  const fetchUserData = async (uid: string) => {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setUserData(userSnap.data() as UserData)
    }
  }

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await createUserDocument(user)
        await fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
  }

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
    setUserData(null)
  }

  const updateUserProfile = async (displayName: string) => {
    if (!user) return
    await updateProfile(user, { displayName })
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, { displayName })
    await refreshUserData()
  }

  const updateUserEmail = async (newEmail: string) => {
    if (!user) return
    await updateEmail(user, newEmail)
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, { email: newEmail })
    await refreshUserData()
  }

  const updateUserPassword = async (newPassword: string) => {
    if (!user) return
    await updatePassword(user, newPassword)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        updateUserProfile,
        updateUserEmail,
        updateUserPassword,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
