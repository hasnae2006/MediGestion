import { useEffect, useState } from 'react';

export const languages = ['fr', 'en', 'ar'];

export function getLang() {
    return localStorage.getItem('lang') || 'fr';
}

export function setAppLang(lang) {
    localStorage.setItem('lang', lang);
    window.dispatchEvent(new CustomEvent('app:lang', { detail: lang }));
}

export function useLang() {
    const [lang, setLang] = useState(getLang);

    useEffect(() => {
        const sync = (event) => setLang(event.detail || getLang());
        window.addEventListener('app:lang', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('app:lang', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    return [lang, setAppLang, lang === 'ar'];
}

export function pick(dict, lang) {
    return dict[lang] || dict.fr;
}
