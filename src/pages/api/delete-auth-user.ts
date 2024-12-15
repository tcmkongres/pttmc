import { auth } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
    console.log("API Route `/api/delete-auth-user` uruchomione.");

    if (req.method !== "POST") {
        console.log("Nieprawidłowa metoda:", req.method);
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { uid } = req.body;

    if (!uid) {
        console.log("Brak UID w żądaniu.");
        return res.status(400).json({ message: "UID użytkownika jest wymagane" });
    }

    try {
        // Usuń użytkownika z Firebase Authentication
        console.log(`Próba usunięcia użytkownika z Authentication o UID: ${uid}`);
        await auth.deleteUser(uid);
        console.log("Użytkownik usunięty z Authentication.");

        return res.status(200).json({ message: "Użytkownik został usunięty z Authentication." });
    } catch (error) {
        console.error("Błąd podczas usuwania użytkownika z Authentication:", error);
        return res.status(500).json({
            message: "Nie udało się usunąć użytkownika z Authentication.",
            error: error.message || "Nieznany błąd",
        });
    }
}
