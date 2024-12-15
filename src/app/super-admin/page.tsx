"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function SuperAdminPage() {
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInactiveUsers(users.filter((user) => user.status === "inactive"));
      setActiveUsers(users.filter((user) => user.status === "active"));
    };

    fetchUsers();
  }, []);

  const handleActivate = async (userId) => {
    await updateDoc(doc(db, "users", userId), { status: "active", role: "editor" });
    setInactiveUsers((prev) => prev.filter((user) => user.id !== userId));
    setActiveUsers((prev) => [...prev, { id: userId, status: "active", role: "editor" }]);
  };

  const handleBlock = async (userId) => {
    await updateDoc(doc(db, "users", userId), { status: "blocked" });
    setActiveUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
      <div>
        <h1>Super Admin Panel</h1>

        <h2>Nieaktywni użytkownicy</h2>
        <ul>
          {inactiveUsers.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName} ({user.email})
                <button onClick={() => handleActivate(user.id)}>Aktywuj</button>
              </li>
          ))}
        </ul>

        <h2>Aktywni użytkownicy</h2>
        <ul>
          {activeUsers.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName} ({user.email}) - {user.role}
                <button onClick={() => handleBlock(user.id)}>Zablokuj</button>
              </li>
          ))}
        </ul>
      </div>
  );
}
