"use client";
import Link from "next/link";

export default function SuperAdminLayout({ children }) {
    return (
        <div>
            <nav>
                <ul className="flex space-x-4 bg-gray-200 p-4">
                    <li>
                        <Link href="/super-admin">Aktywni użytkownicy</Link>
                    </li>
                    <li>
                        <Link href="/super-admin/blocked-users">Zablokowani użytkownicy</Link>
                    </li>
                </ul>
            </nav>
            <main className="p-4">{children}</main>
        </div>
    );
}
