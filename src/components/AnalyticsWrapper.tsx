"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { app } from "../lib/firebase";

export default function AnalyticsWrapper() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            isSupported().then((supported) => {
                if (supported) {
                    const analytics = getAnalytics(app);
                    console.log("Firebase Analytics zostało zainicjalizowane.");
                } else {
                    console.log("Firebase Analytics nie jest obsługiwane w tej przeglądarce.");
                }
            });
        }
    }, []);

    return null;
}
