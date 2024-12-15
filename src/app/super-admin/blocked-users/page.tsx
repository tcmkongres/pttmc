"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getAuth } from "firebase/auth";

export default function BlockedUsersPage() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pobieranie zablokowanych użytkowników
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                const users = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBlockedUsers(users.filter((user) => user.status === "blocked"));
                setLoading(false);
            },
            (error) => {
                console.error("Błąd podczas nasłuchiwania użytkowników:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Usuń nasłuchiwanie po odmontowaniu komponentu
    }, []);

    // Usuwanie użytkownika z Authentication
    const handleDeleteFromAuth = async (uid) => {

        if (uid== undefined){
        console.log("Brak UID w żądaniu.", uid);

            return;
        }else {
            console.log(`UID do usunięcia: ${uid}`);
        }
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika z Authentication?")) {
            return;
        }

        try {
            const response = await fetch("/api/delete-auth-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Błąd:", errorData);
                alert(`Błąd: ${errorData.message}`);
                return;
            }

            alert("Użytkownik został usunięty z Authentication.");
        } catch (error) {
            console.error("Nieoczekiwany błąd podczas usuwania z Authentication:", error);
            alert("Wystąpił błąd podczas usuwania użytkownika z Authentication.");
        }
    };

    // Usuwanie użytkownika z Firestore
    const handleDeleteFromFirestore = async (uid) => {
        console.log("Próba usunięcia użytkownika o UID:", uid);

        const confirmDelete = window.confirm(
            "Czy na pewno chcesz usunąć tego użytkownika z Firestore?"
        );

        if (!confirmDelete) return;

        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken(); // Pobierz token JWT

            const response = await fetch("/api/delete-firestore-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Token w nagłówku Authorization
                },
                body: JSON.stringify({ uid }), // UID użytkownika do usunięcia
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Błąd:", errorData);
                alert(`Błąd: ${errorData.message}`);
                return;
            }

            alert("Użytkownik został usunięty z Firestore.");
        } catch (error) {
            console.error("Nieoczekiwany błąd podczas usuwania z Firestore:", error);
            alert("Wystąpił błąd podczas usuwania użytkownika z Firestore.");
        }
    };


    if (loading) {
        return <p>Ładowanie zablokowanych użytkowników...</p>;
    }

    if (blockedUsers.length === 0) {
        return <p>Brak zablokowanych użytkowników.</p>;
    }

    return (
        <div>
            <h1>Zablokowani użytkownicy</h1>
            <table className="table-auto w-full border-collapse border border-gray-500">
                <thead>
                <tr>
                    <th className="border border-gray-400 px-4 py-2">UID</th>
                    <th className="border border-gray-400 px-4 py-2">Email</th>
                    <th className="border border-gray-400 px-4 py-2">Imię i nazwisko</th>
                    <th className="border border-gray-400 px-4 py-2">Akcje</th>
                </tr>
                </thead>
                <tbody>
                {blockedUsers.map((user) => (
                    <tr key={user.id}>
                        <td className="border border-gray-400 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-400 px-4 py-2">
                            {user.firstName} {user.lastName}
                        </td>
                        <td className="border border-gray-400 px-4 py-2 space-x-2">
                            <button
                                onClick={() => handleDeleteFromAuth(user.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Usuń z Authentication
                            </button>
                            <button
                                onClick={() => handleDeleteFromFirestore(user.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Usuń z Firestore
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
