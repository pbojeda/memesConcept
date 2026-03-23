"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consented = localStorage.getItem("cookie-consent");
        if (!consented) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem("cookie-consent", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm">
                <p>Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. Al continuar navegando, aceptas nuestra <a href="/privacy" className="underline hover:text-gray-300">política de privacidad</a>.</p>
            </div>
            <button
                onClick={accept}
                className="whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 cursor-pointer"
            >
                Aceptar
            </button>
        </div>
    );
}
