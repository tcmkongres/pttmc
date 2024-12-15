import { auth } from "../../lib/firebaseAdmin";
import { db } from "../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
    console.log("API Route `/api/delete-user` uruchomione.");

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ message: "UID użytkownika jest wymagane" });
    }

    try {
        // Usuń użytkownika z Firebase Authentication
        console.log(`Próba usunięcia użytkownika z Authentication o UID: ${uid}`);
        await auth.deleteUser(uid);
        console.log("Użytkownik usunięty z Authentication.");

        // Usuń użytkownika z Firestore
        console.log(`Próba usunięcia użytkownika z Firestore o UID: ${uid}`);
        await deleteDoc(doc(db, "users", uid));
        console.log("Użytkownik usunięty z Firestore.");

        return res.status(200).json({ message: "Użytkownik został trwale usunięty z Authentication i Firestore." });
    } catch (error) {
        console.error("Błąd podczas usuwania użytkownika:", error);
        return res.status(500).json({
            message: "Nie udało się usunąć użytkownika.",
            error: error.message || "Nieznany błąd",
        });
    }
}
