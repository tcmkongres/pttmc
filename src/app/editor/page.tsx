"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

export default function EditorPage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (
      !(role === "editor" || role === "admin" || role === "superadmin")
    ) {
      router.push("/");
    }
  }, [user, role, router]);

  if (
    !user ||
    !(role === "editor" || role === "admin" || role === "superadmin")
  ) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h1>Panel Redaktora</h1>
      <p>Tu możesz dodawać i edytować artykuły.</p>
      {/* Formularz do obsługi artykułów */}
    </div>
  );
}
