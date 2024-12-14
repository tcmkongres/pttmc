// lib/auth.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getUserRole(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
        return userDoc.data().role;
    }
    return null;
}
