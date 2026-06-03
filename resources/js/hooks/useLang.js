import { useEffect, useState } from 'react';

function getStoredLang() {
    try {
        return localStorage.getItem('lang') || 'fr';
    } catch {
        return 'fr';
    }
}

export function useLang() {
    const [lang, setLang] = useState(getStoredLang);

    useEffect(() => {
        const sync = (event) => {
            setLang(event.detail || getStoredLang());
        };

        window.addEventListener('app:lang', sync);
        window.addEventListener('storage', sync);

        return () => {
            window.removeEventListener('app:lang', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    return lang;
}
