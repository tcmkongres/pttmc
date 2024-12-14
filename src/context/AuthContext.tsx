"use client";

import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserRole } from '../lib/auth';

export const AuthContext = createContext({ user: null, role: null });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (usr) => {
            if (usr) {
                setUser(usr);
                const r = await getUserRole(usr.uid);
                setRole(r);
            } else {
                setUser(null);
                setRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role }}>
    {children}
    </AuthContext.Provider>
);
}
