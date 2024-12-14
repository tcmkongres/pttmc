"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

export default function SuperAdminPage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (role !== "superadmin") {
      router.push("/");
    }
  }, [user, role, router]);

  if (!user || role !== "superadmin") {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h1>Panel Super Admina</h1>
      <p>Możesz zarządzać adminami.</p>
      {/* Formularze do nadawania/usuwania roli admin */}
    </div>
  );
}
