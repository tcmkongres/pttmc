"use client";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
export default function HomePage() {
  const { user, role } = useContext(AuthContext);

  return (
    <div>
      <h1>Lista Artykułów</h1>
      <p>Publiczna strona. Tutaj będzie lista postów.</p>
      {user ? (
        <div>
          <p>
            Zalogowany jako: {user.email}, rola: {role}
          </p>
          <Link href="/editor">Panel Redaktora</Link>{" "}
          {(role === "admin" || role === "superadmin") && (
            <Link href="/admin">Panel Admina</Link>
          )}{" "}
          {role === "superadmin" && (
            <Link href="/super-admin">Panel Super Admina</Link>
          )}
        </div>
      ) : (
        <Link href="/login">Zaloguj się</Link>
      )}
    </div>
  );
}
