import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const colors = {
    primary: '#1E3A5F',
    primaryLight: '#2D5A9E',
    accent: '#10B981',
    bg: '#F0F4F8',
    white: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
    danger: '#EF4444',
};

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Head title="Connexion" />

            <div style={{ display: 'flex', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderRadius: 16, overflow: 'hidden', width: 820, maxWidth: '95vw' }}>

                {/* Panneau gauche */}
                <div style={{ backgroundColor: colors.primary, width: 320, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                        <div style={{ width: 44, height: 44, backgroundColor: colors.white, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💊</div>
                        <div>
                            <div style={{ color: colors.white, fontWeight: 800, fontSize: 18 }}>MediRappel</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Système de gestion</div>
                        </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 2 }}>
                        <p style={{ margin: 0 }}>✅ Rappels automatiques</p>
                        <p style={{ margin: 0 }}>📊 Suivi des prises</p>
                        <p style={{ margin: 0 }}>🚨 Alertes SOS</p>
                        <p style={{ margin: 0 }}>📄 Gestion ordonnances</p>
                    </div>
                </div>

                {/* Formulaire */}
                <div style={{ backgroundColor: colors.white, flex: 1, padding: 40 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.text, marginBottom: 4 }}>Connexion</h2>
                    <p style={{ color: colors.textMuted, fontSize: 14, marginBottom: 28 }}>Accédez à votre espace MediRappel</p>

                    {status && (
                        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>

                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                placeholder="votre@email.com"
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.email ? colors.danger : colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                            />
                            {errors.email && <p style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                        </div>

                        {/* Mot de passe */}
                        <div style={{ marginBottom: 16 }}>
                            <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.password ? colors.danger : colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                            />
                            {errors.password && <p style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember" style={{ fontSize: 13, color: colors.textMuted, cursor: 'pointer' }}>
                                Se souvenir de moi
                            </label>
                        </div>

                        {/* Bouton + mot de passe oublié */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{ width: '100%', padding: '14px', backgroundColor: colors.primaryLight, color: colors.white, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}
                            >
                                {processing ? 'Connexion...' : 'Se connecter'}
                            </button>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ textAlign: 'center', fontSize: 13, color: colors.primaryLight, textDecoration: 'none' }}
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}