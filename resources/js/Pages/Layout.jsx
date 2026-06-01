import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const colors = {
    primary: '#1E3A5F',
    primaryLight: '#2D5A9E',
    accent: '#10B981',
    danger: '#EF4444',
    white: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
};

// ─── Toast Flash ─────────────────────────────────────────────
function Toast({ flash }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const isSuccess = !!flash.success;

    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            backgroundColor: isSuccess ? colors.accent : colors.danger,
            color: colors.white, borderRadius: 10, padding: '12px 20px',
            fontWeight: 600, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.3s',
        }}>
            {isSuccess ? '✅' : '⚠️'} {flash.success || flash.error}
        </div>
    );
}

// ─── Sidebar ─────────────────────────────────────────────────
function Sidebar({ items, currentUrl, onNavigate, role, bgColor, notificationsCount, alertesCount }) {
    return (
        <div style={{ width: 220, backgroundColor: bgColor || colors.primary, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}>
            <div style={{ padding: '24px 20px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, backgroundColor: colors.white, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💊</div>
                    <div>
                        <div style={{ color: colors.white, fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>MediGestion</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Système de gestion</div>
                    </div>
                </div>
                <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{role}</div>
            </div>

            <nav style={{ flex: 1 }}>
                {items.map((item) => {
                    const isActive = currentUrl === item.href;
                    const badge = item.key === 'alertes' ? alertesCount : item.key === 'notifications' ? notificationsCount : null;

                    return (
                        <button
                            key={item.key}
                            onClick={() => router.visit(item.href)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 20px',
                                border: 'none', backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                                color: isActive ? colors.white : 'rgba(255,255,255,0.65)',
                                fontSize: 14, fontWeight: isActive ? 700 : 400, cursor: 'pointer', textAlign: 'left',
                                borderLeft: isActive ? '3px solid #10B981' : '3px solid transparent',
                            }}
                        >
                            <span>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {badge > 0 && (
                                <span style={{ backgroundColor: colors.danger, color: colors.white, borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                                    {badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={() => router.post('/logout')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '14px 20px', border: 'none', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
                <span>🚪</span><span>Déconnexion</span>
            </button>
        </div>
    );
}

// ─── Layout principal ─────────────────────────────────────────
export default function AppLayout({ children }) {
    const { auth, flash, notificationsCount, alertesCount } = usePage().props;
    const currentUrl = window.location.pathname;

    const isResponsable = auth.user?.role === 'responsable';

    const responsableItems = [
    { key: 'dashboard',   icon: '🏠', label: 'Tableau de bord',   href: '/responsable/dashboard' },
    { key: 'patients',    icon: '👥', label: 'Patients',           href: '/responsable/patients' },
    { key: 'ordonnances', icon: '📄', label: 'Ordonnances',        href: '/responsable/ordonnances' },
    { key: 'medicaments', icon: '💊', label: 'Médicaments',        href: '/responsable/medicaments' },
    { key: 'medecins',    icon: '🩺', label: 'Médecins',           href: '/responsable/medecins' },
    { key: 'alertes',     icon: '🚨', label: 'Alertes',            href: '/responsable/alertes' },
    { key: 'historique',  icon: '📊', label: 'Historique',         href: '/responsable/historique' },
];

    const patientItems = [
        { key: 'dashboard',      icon: '🏠', label: 'Tableau de bord',     href: '/patient/dashboard' },
        { key: 'notifications',  icon: '🔔', label: 'Notifications',       href: '/patient/notifications' },
        { key: 'sos',            icon: '🆘', label: 'SOS / Urgence',       href: '/patient/sos' },
         { key: 'profil',        icon: '👤', label: 'Mon Profil',       href: '/patient/profil' }, // ← ajoute
    ];

    const items = isResponsable ? responsableItems : patientItems;
    const bgColor = isResponsable ? '#0F2847' : colors.primary;
    const role = isResponsable ? 'Espace Responsable' : 'Espace Patient';

    return (
        <div style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", backgroundColor: '#F0F4F8', minHeight: '100vh', display: 'flex' }}>
            <Sidebar
                items={items}
                currentUrl={currentUrl}
                role={role}
                bgColor={bgColor}
                notificationsCount={notificationsCount}
                alertesCount={alertesCount}
            />
            <main style={{ marginLeft: 220, padding: 24, minHeight: '100vh', flex: 1 }}>
                {children}
            </main>
            <Toast flash={flash} />
        </div>
    );
}
