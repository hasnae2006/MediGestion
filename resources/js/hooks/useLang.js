// resources/js/hooks/useLang.js
import { useState, useEffect } from 'react';

export function useLang() {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');

    useEffect(() => {
        const handleStorage = () => {
            setLang(localStorage.getItem('lang') || 'fr');
        };

        window.addEventListener('storage', handleStorage);

        // Polling toutes les 300ms pour détecter le changement
        const interval = setInterval(() => {
            const current = localStorage.getItem('lang') || 'fr';
            setLang(prev => prev !== current ? current : prev);
        }, 300);

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    return lang;
}