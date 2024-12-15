"use client";
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AdminPage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  const [newUid, setNewUid] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!(role === 'admin' || role === 'superadmin')) {
      router.push('/');
    }
  }, [user, role, router]);

  async function handleAddEditor(e) {
    e.preventDefault();
    if(!newUid) return;
    await setDoc(doc(db, 'users', newUid), { role: 'editor' }, { merge: true });
    setNewUid('');
    alert('Dodano redaktora!');
  }

  if (!user || !(role === 'admin' || role === 'superadmin')) {
    return <p>Ładowanie...</p>;
  }

  return (
      <div>
        <h1>Panel Admina</h1>
        <p>Możesz dodawać/usuwać redaktorów.</p>
        <form onSubmit={handleAddEditor}>
          <input placeholder="UID użytkownika" value={newUid} onChange={e=>setNewUid(e.target.value)} />
          <button type="submit">Nadaj rolę Editor</button>
        </form>
      </div>
  );
}
