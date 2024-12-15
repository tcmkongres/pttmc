import { db } from "../../lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
    console.log("API Route `/api/delete-firestore-user` uruchomione.");

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { uid } = req.body;

    if (!uid) {
        console.log("Brak UID w żądaniu.");
        return res.status(400).json({ message: "UID użytkownika jest wymagane" });
    }

    try {
        // Pobierz token JWT i zweryfikuj go
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            console.log("Brak nagłówka Authorization.");
            return res.status(401).json({ message: "Nieautoryzowany dostęp." });
        }

        const token = authorizationHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(token);
        const currentUserUid = decodedToken.uid;

        console.log("Zalogowany UID użytkownika:", currentUserUid);

        // Sprawdź dane zalogowanego użytkownika w Firestore
        const currentUserDoc = await getDoc(doc(db, "users", currentUserUid));
        if (!currentUserDoc.exists()) {
            console.log("Dokument użytkownika nie istnieje w Firestore.");
            return res.status(403).json({ message: "Brak dostępu." });
        }

        const currentUserData = currentUserDoc.data();
        console.log("Dane zalogowanego użytkownika:", currentUserData);

        if (currentUserData.role !== "superadmin") {
            console.log("Brak uprawnień. Rola:", currentUserData.role);
            return res.status(403).json({ message: "Brak uprawnień do usunięcia użytkownika." });
        }

        // Usuń użytkownika z Firestore
        const userDocRef = doc(db, "users", uid);
        await deleteDoc(userDocRef);

        console.log("Użytkownik usunięty z Firestore.");
        return res.status(200).json({ message: "Użytkownik został usunięty z Firestore." });
    } catch (error) {
        console.error("Błąd podczas usuwania użytkownika z Firestore:", error);
        return res.status(500).json({
            message: "Nie udało się usunąć użytkownika z Firestore.",
            error: error.message || "Nieznany błąd",
        });
    }
}
