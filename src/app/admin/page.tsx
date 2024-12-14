"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

export default function AdminPage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!(role === "admin" || role === "superadmin")) {
      router.push("/");
    }
  }, [user, role, router]);

  if (!user || !(role === "admin" || role === "superadmin")) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h1>Panel Admina</h1>
      <p>Możesz dodawać/usuwać redaktorów.</p>
      {/* Formularze do zarządzania użytkownikami */}
    </div>
  );
}
