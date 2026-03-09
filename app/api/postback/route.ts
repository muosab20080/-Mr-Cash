import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase' 
import { doc, getDoc, updateDoc, setDoc, increment, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'

const MY_SECRET_KEY = "muosab123"; 

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id') || searchParams.get('userId');
    const pointsRaw = searchParams.get('points') || searchParams.get('amount');
    const receivedKey = searchParams.get('secret'); 
    const transactionId = searchParams.get('transaction_id') || `auto_${Date.now()}`;

    // 1. الحماية
    if (receivedKey !== MY_SECRET_KEY) {
      return new NextResponse('Error: Unauthorized Access', { status: 403 });
    }

    if (!userId || !pointsRaw) {
      return new NextResponse('Error: Missing Data', { status: 200 });
    }

    const pointsToAdd = Math.max(1, Math.round(parseFloat(pointsRaw)));

    // --- الخوارزمية الذكية للبحث (ID أو إيميل) ---
    let userFoundRef = null;
    const cleanId = userId.trim();

    // أ- محاولة البحث كـ "Document ID" (الأيدي المباشر)
    const directDocRef = doc(db, 'users', cleanId);
    const directDocSnap = await getDoc(directDocRef);

    if (directDocSnap.exists()) {
      userFoundRef = directDocRef;
    } else if (cleanId.includes('@')) {
      // ب- إذا لم يوجد كـ ID وكان النص يحتوي على @، نبحث عنه كـ "إيميل"
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', cleanId.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        userFoundRef = doc(db, 'users', querySnapshot.docs[0].id);
      }
    }

    // 2. تنفيذ التحديث أو الإنشاء
    if (userFoundRef) {
      // تحديث مستخدم موجود
      await updateDoc(userFoundRef, {
        points: increment(pointsToAdd),
        completedOffers: increment(1),
        lastUpdate: serverTimestamp()
      });
    } else {
      // إنشاء مستخدم جديد (سواء كان المرسل أيدي أو إيميل)
      const isEmail = cleanId.includes('@');
      const newUserData = {
        [isEmail ? 'email' : 'uid']: cleanId,
        points: pointsToAdd,
        username: cleanId.split('@')[0],
        status: 'Active',
        createdAt: serverTimestamp()
      };
      
      // إذا كان المرسل أيدي نستخدمه كـ ID للوثيقة، وإذا كان إيميل نترك فايربيز ينشئ ID تلقائي
      if (!isEmail) {
        await setDoc(doc(db, 'users', cleanId), newUserData);
      } else {
        await addDoc(collection(db, 'users'), newUserData);
      }
    }

    // 3. تسجيل العملية
    await addDoc(collection(db, 'transactions'), {
      targetUser: cleanId,
      points: pointsToAdd,
      transactionId,
      source: 'MultiMode_Secure_Postback',
      createdAt: serverTimestamp()
    });

    return new NextResponse('Success: Points added via ID/Email search', { status: 200 });

  } catch (error) {
    console.error('Postback Error:', error);
    return new NextResponse('Error Processing Request', { status: 200 });
  }
}

export async function POST(request: NextRequest) { return GET(request); }
