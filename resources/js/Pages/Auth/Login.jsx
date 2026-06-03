import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const translations = {
    fr: {
        title: 'Connexion',
        subtitle: 'Accédez à votre espace MediGestion.',
        email: 'Email',
        password: 'Mot de passe',
        remember: 'Se souvenir de moi',
        forgot: 'Mot de passe oublié ?',
        submit: 'Se connecter',
        submitting: 'Connexion...',
        noAccount: 'Pas encore de compte ?',
        register: 'Créer un compte',
        role: 'Type de compte',
        patient: 'Patient',
        responsable: 'Responsable',
        introTitle: 'Suivi médical clair, simple et sécurisé.',
        features: ['Rappels de prises', 'Alertes SOS', 'Gestion des ordonnances', 'Stock des médicaments'],
    },
    en: {
        title: 'Login',
        subtitle: 'Access your MediGestion space.',
        email: 'Email',
        password: 'Password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        submit: 'Sign in',
        submitting: 'Signing in...',
        noAccount: 'No account yet?',
        register: 'Create one',
        role: 'Account type',
        patient: 'Patient',
        responsable: 'Manager',
        introTitle: 'Clear, simple and secure medical follow-up.',
        features: ['Medication reminders', 'SOS alerts', 'Prescription management', 'Medicine stock'],
    },
    ar: {
        title: 'تسجيل الدخول',
        subtitle: 'ادخل إلى فضاء MediGestion الخاص بك.',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        remember: 'تذكرني',
        forgot: 'نسيت كلمة المرور؟',
        submit: 'تسجيل الدخول',
        submitting: 'جار تسجيل الدخول...',
        noAccount: 'ليس لديك حساب؟',
        register: 'إنشاء حساب',
        role: 'نوع الحساب',
        patient: 'مريض',
        responsable: 'مسؤول',
        introTitle: 'متابعة طبية واضحة وبسيطة وآمنة.',
        features: ['تذكير بالأدوية', 'تنبيهات الطوارئ', 'إدارة الوصفات', 'مخزون الأدوية'],
    },
};

function LangSelector({ lang, setLang }) {
    return (
        <div className="lang-switch" style={{ justifyContent: 'flex-end', padding: 0, border: 0, marginBottom: 12 }}>
            {['fr', 'en', 'ar'].map((code) => (
                <button
                    key={code}
                    type="button"
                    className={lang === code ? 'is-active' : ''}
                    onClick={() => setLang(code)}
                    style={{ flex: '0 0 auto', minWidth: 48 }}
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="field">
            <label>{label}</label>
            {children}
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default function Login({ status, canResetPassword }) {
    const [lang, setLangState] = useState(() => {
        try {
            return localStorage.getItem('lang') || 'fr';
        } catch {
            return 'fr';
        }
    });
    const t = translations[lang] || translations.fr;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role: 'patient',
    });

    const setLang = (code) => {
        try {
            localStorage.setItem('lang', code);
            window.dispatchEvent(new CustomEvent('app:lang', { detail: code }));
        } catch {}
        setLangState(code);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="auth-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Head title={t.title} />
            <div className="auth-wrap">
                <LangSelector lang={lang} setLang={setLang} />

                <div className="auth-card">
                    <aside className="auth-aside">
                        <div className="brand-mark" style={{ marginBottom: 24 }}>MG</div>
                        <h1 className="auth-title">MediGestion</h1>
                        <p className="auth-subtitle">{t.introTitle}</p>
                        <div style={{ display: 'grid', gap: 12 }}>
                            {t.features.map((feature) => (
                                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)' }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--teal)' }} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <section className="auth-form">
                        <h2 className="auth-title">{t.title}</h2>
                        <p className="auth-subtitle">{t.subtitle}</p>

                        {status && (
                            <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: 'rgba(16,185,129,.1)', color: 'var(--teal)', fontWeight: 800 }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <Field label={t.role} error={errors.role}>
                                <div className="segmented">
                                    {['patient', 'responsable'].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            className={data.role === role ? 'is-active' : ''}
                                            onClick={() => setData('role', role)}
                                        >
                                            {role === 'patient' ? t.patient : t.responsable}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            <Field label={t.email} error={errors.email}>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    autoComplete="username"
                                    placeholder="nom@email.com"
                                    required
                                />
                            </Field>

                            <Field label={t.password} error={errors.password}>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </Field>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 22 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(event) => setData('remember', event.target.checked)}
                                    />
                                    {t.remember}
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} style={{ color: 'var(--blue)', fontWeight: 800, textDecoration: 'none' }}>
                                        {t.forgot}
                                    </Link>
                                )}
                            </div>

                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? t.submitting : t.submit}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 22 }}>
                            {t.noAccount}{' '}
                            <Link href={route('register')} style={{ color: 'var(--blue)', fontWeight: 900, textDecoration: 'none' }}>
                                {t.register}
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
