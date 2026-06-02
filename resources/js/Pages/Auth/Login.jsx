import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
const C = {
    bg:          '#0F1535',
    bgCard:      'rgba(255,255,255,0.07)',
    blue:        '#818CF8', blueSoft: 'rgba(129,140,248,0.15)',
    purple:      '#A78BFA', purpleSoft: 'rgba(167,139,250,0.15)',
    green:       '#34D399', greenSoft: 'rgba(52,211,153,0.15)',
    red:         '#F87171', redSoft: 'rgba(248,113,113,0.15)',
    yellow:      '#FBBF24', yellowSoft: 'rgba(251,191,36,0.15)',
    cyan:        '#67E8F9',
    text:        '#F1F5F9', textMuted: '#94A3B8', textHint: '#475569',
    border:      'rgba(255,255,255,0.10)',
    borderLight: 'rgba(255,255,255,0.05)',
    white:       '#FFFFFF',
};

const glass = (extra = {}) => ({
    backgroundColor: C.bgCard,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 20,
    border: `1px solid ${C.border}`,
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    ...extra,
});

const inputStyle = (hasError = false) => ({
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid ${hasError ? C.red : C.border}`,
    borderRadius: 10,
    fontSize: 14,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: C.text,
    outline: 'none',
    transition: 'all 0.2s',
});
const translations = {
    fr: {
        title: 'Connexion',
        subtitle: 'Accédez à votre espace MediGestion',
        email: 'Email',
        password: 'Mot de passe',
        remember: 'Se souvenir de moi',
        forgot: 'Mot de passe oublié ?',
        submit: 'Se connecter',
        submitting: 'Connexion...',
        noAccount: 'Pas encore de compte ?',
        contact: 'Inscrivez-vous',
        role: 'VOUS ÊTES :',
        patient: 'Patient',
        responsable: 'Responsable',
        features: ['Rappels automatiques', 'Suivi des prises', 'Alertes SOS', 'Gestion ordonnances'],
        system: 'Système de gestion',
    },
    en: {
        title: 'Login',
        subtitle: 'Access your MediGestion space',
        email: 'Email',
        password: 'Password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        submit: 'Sign in',
        submitting: 'Signing in...',
        noAccount: 'No account yet?',
        contact: 'Create one',
        role: 'YOU ARE:',
        patient: 'Patient',
        responsable: 'Manager',
        features: ['Automatic reminders', 'Medication tracking', 'SOS alerts', 'Prescription management'],
        system: 'Management System',
    },
    ar: {
        title: 'تسجيل الدخول',
        subtitle: 'ادخل إلى فضاء MediGestion الخاص بك',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        remember: 'تذكرني',
        forgot: 'نسيت كلمة المرور؟',
        submit: 'تسجيل الدخول',
        submitting: 'جارٍ الدخول...',
        noAccount: 'ليس لديك حساب؟',
        contact: 'سجل حساب جديد',
        role: 'أنت:',
        patient: 'مريض',
        responsable: 'مسؤول',
        features: ['تذكيرات تلقائية', 'متابعة الجرعات', 'تنبيهات الطوارئ', 'إدارة الوصفات'],
        system: 'نظام إداري',
    },
};
function LogoCoeur({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 80 C50 80 15 55 15 32 C15 20 25 12 35 12 C42 12 48 16 50 20 C52 16 58 12 65 12 C75 12 85 20 85 32 C85 55 50 80 50 80Z" fill="white"/>
            <rect x="43" y="28" width="14" height="5" rx="2.5" fill={C.blue}/>
            <rect x="45.5" y="25" width="9" height="11" rx="2.5" fill={C.blue}/>
        </svg>
    );
}
function LangSelector({ lang, setLang }) {
    const langs = [
        { code: 'fr', label: 'FR', flag: '🇫🇷' },
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'ar', label: 'ع',  flag: '🇲🇦' },
    ];
    return (
        <div style={{ display: 'flex', gap: 6 }}>
            {langs.map(l => (
                <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    style={{
                        padding: '5px 10px',
                        borderRadius: 8,
                        border: `1.5px solid ${lang === l.code ? C.blue : C.border}`,
                        backgroundColor: lang === l.code ? C.blueSoft : 'rgba(255,255,255,0.04)',
                        color: lang === l.code ? C.blue : C.textMuted,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                        transition: 'all 0.2s',
                    }}
                >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                </button>
            ))}
        </div>
    );
}

export default function Login({ status, canResetPassword }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('lang') || 'fr';
    });
    const t = translations[lang] || translations.fr;
    const isRtl = lang === 'ar';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role: 'patient',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const setLanguage = (code) => {
        localStorage.setItem('lang', code);
        setLang(code);
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: C.bg,
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Nunito','Segoe UI',sans-serif",
            padding: 16,
            flexDirection: 'column',
            gap: 16,
        }}>
            <Head title={t.title} />

            <div style={{ width: 900, maxWidth: '95vw', display: 'flex', justifyContent: 'flex-end' }}>
                <LangSelector lang={lang} setLang={setLanguage} />
            </div>

            <div style={{
                display: 'flex',
                borderRadius: 20,
                overflow: 'hidden',
                width: 900,
                maxWidth: '95vw',
                direction: isRtl ? 'rtl' : 'ltr',
                ...glass({ padding: 0 }),
            }}>
                <div style={{
                    width: 340, flexShrink: 0,
                    padding: '48px 36px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(167,139,250,0.08))',
                }}>
                    <div style={{ position: 'absolute', top: -70, right: -70, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(129,140,248,0.08)' }} />
                    <div style={{ position: 'absolute', bottom: -50, left: -50, width: 180, height: 180, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.08)' }} />

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#818CF8,#A78BFA)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 15px rgba(129,140,248,0.3)' }}>
                                <LogoCoeur size={34} />
                            </div>
                            <div>
                                <div style={{ color: C.text, fontWeight: 800, fontSize: 20, lineHeight: 1.1 }}>MediGestion</div>
                                <div style={{ color: C.textMuted, fontSize: 11, marginTop: 3 }}>{t.system}</div>
                            </div>
                        </div>

                        <div style={{ width: 36, height: 3, background: 'linear-gradient(90deg,#818CF8,#A78BFA)', borderRadius: 2, marginBottom: 28 }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {t.features.map((label, idx) => {
                                const icons = ['✅', '📊', '🚨', '📄'];
                                return (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 16 }}>{icons[idx]}</span>
                                        <span style={{ color: C.textMuted, fontSize: 13 }}>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: 40 }}>
                        <p style={{ color: C.textHint, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, marginTop: 0, fontWeight: 700 }}>
                            {t.role}
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {['patient', 'responsable'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setData('role', r)}
                                    style={{
                                        flex: 1, padding: '12px 8px',
                                        border: `1.5px solid ${data.role === r ? C.blue : C.border}`,
                                        borderRadius: 12,
                                        backgroundColor: data.role === r ? C.blueSoft : 'rgba(255,255,255,0.04)',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: data.role === r ? C.blueSoft : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {r === 'patient'
                                            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill={data.role === r ? C.blue : C.textMuted}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={data.role === r ? C.blue : C.textMuted} strokeWidth="2" strokeLinecap="round"/></svg>
                                            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="3" fill={data.role === r ? C.blue : C.textMuted}/><circle cx="6" cy="9" r="2" fill={data.role === r ? C.blue : C.textMuted} opacity="0.6"/><circle cx="18" cy="9" r="2" fill={data.role === r ? C.blue : C.textMuted} opacity="0.6"/><path d="M2 20c0-3 2.5-5 6-5" stroke={data.role === r ? C.blue : C.textMuted} strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/><path d="M22 20c0-3-2.5-5-6-5" stroke={data.role === r ? C.blue : C.textMuted} strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={data.role === r ? C.blue : C.textMuted} strokeWidth="2" strokeLinecap="round"/></svg>
                                        }
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: data.role === r ? C.blue : C.textMuted }}>
                                        {r === 'patient' ? t.patient : t.responsable}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{
                    flex: 1,
                    padding: '48px 44px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    direction: isRtl ? 'rtl' : 'ltr',
                }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6, marginTop: 0 }}>
                        {t.title}
                    </h2>
                    <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 32, marginTop: 0 }}>
                        {t.subtitle}
                    </p>

                    {status && (
                        <div style={{ backgroundColor: C.greenSoft, color: C.green, padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t.email}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                placeholder="votre@email.com"
                                style={inputStyle(errors.email)}
                            />
                            {errors.email && <p style={{ color: C.red, fontSize: 12, margin: '4px 0 0' }}>{errors.email}</p>}
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {t.password}
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} style={{ fontSize: 12, color: C.blue, textDecoration: 'none', fontWeight: 600 }}>
                                        {t.forgot}
                                    </Link>
                                )}
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                style={inputStyle(errors.password)}
                            />
                            {errors.password && <p style={{ color: C.red, fontSize: 12, margin: '4px 0 0' }}>{errors.password}</p>}
                        </div>

                        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: C.blue, cursor: 'pointer' }}
                            />
                            <label htmlFor="remember" style={{ fontSize: 13, color: C.textMuted, cursor: 'pointer' }}>
                                {t.remember}
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '14px',
                                background: 'linear-gradient(135deg,#818CF8,#6366F1)',
                                color: C.white, border: 'none',
                                borderRadius: 10, fontSize: 15, fontWeight: 700,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.7 : 1,
                                transition: 'all 0.2s',
                            }}
                        >
                            {processing ? `⏳ ${t.submitting}` : t.submit}
                        </button>

                        <input type="hidden" name="role" value={data.role} />
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 12, color: C.textMuted, marginTop: 28, marginBottom: 0 }}>
                        {t.noAccount}{' '}
                        <Link href={route('register')} style={{ color: C.blue, fontWeight: 700, textDecoration: 'none' }}>{t.contact}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}