import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const C = {
    bg:           '#0F1535',
    bgCard:       'rgba(255,255,255,0.07)',
    sidebar:      '#151A45',
    sidebarBorder:'rgba(255,255,255,0.08)',
    sidebarItem:  'rgba(255,255,255,0.0)',
    sidebarActive:'rgba(129,140,248,0.18)',
    blue:         '#818CF8',
    blueSoft:     'rgba(129,140,248,0.15)',
    purple:       '#A78BFA',
    green:        '#34D399',
    red:          '#F87171',
    yellow:       '#FBBF24',
    text:         '#F1F5F9',
    textMuted:    '#94A3B8',
    textHint:     '#475569',
    border:       'rgba(255,255,255,0.10)',
    borderLight:  'rgba(255,255,255,0.05)',
    white:        '#FFFFFF',
};

const text = {
    fr: {
        system: 'Système de gestion', logout: 'Déconnexion',
        responsableRole: 'Espace Responsable', patientRole: 'Espace Patient',
        dashboard: 'Tableau de bord', patients: 'Patients',
        ordonnances: 'Ordonnances', medicaments: 'Médicaments',
        medecins: 'Médecins', alertes: 'Alertes', historique: 'Historique',
        notifications: 'Notifications', sos: 'SOS / Urgence', profil: 'Mon profil', menu: 'Menu',
    },
    en: {
        system: 'Management system', logout: 'Log out',
        responsableRole: 'Manager Space', patientRole: 'Patient Space',
        dashboard: 'Dashboard', patients: 'Patients',
        ordonnances: 'Prescriptions', medicaments: 'Medicines',
        medecins: 'Doctors', alertes: 'Alerts', historique: 'History',
        notifications: 'Notifications', sos: 'SOS / Emergency', profil: 'My Profile', menu: 'Menu',
    },
    ar: {
        system: 'نظام الإدارة', logout: 'تسجيل الخروج',
        responsableRole: 'فضاء المسؤول', patientRole: 'فضاء المريض',
        dashboard: 'لوحة التحكم', patients: 'المرضى',
        ordonnances: 'الوصفات', medicaments: 'الأدوية',
        medecins: 'الأطباء', alertes: 'التنبيهات', historique: 'السجل',
        notifications: 'الإشعارات', sos: 'طوارئ', profil: 'ملفي الشخصي', menu: 'القائمة',
    },
};
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
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            background: flash.success
                ? 'linear-gradient(135deg,#34D399,#059669)'
                : 'linear-gradient(135deg,#F87171,#DC2626)',
            color: '#fff',
            borderRadius: 12, padding: '12px 20px',
            fontWeight: 700, fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
        }}>
            {flash.success || flash.error}
        </div>
    );
}
function SidebarItem({ icon, label, active, badge, onClick, isRtl }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 18px', fontSize: 13,
                color: active ? C.blue : C.textMuted,
                background: active ? C.sidebarActive : C.sidebarItem,
                border: 'none',
                borderLeft:  isRtl ? 'none' : `3px solid ${active ? C.blue : 'transparent'}`,
                borderRight: isRtl ? `3px solid ${active ? C.blue : 'transparent'}` : 'none',
                cursor: 'pointer', width: '100%',
                textAlign: isRtl ? 'right' : 'left',
                fontWeight: active ? 700 : 400,
                transition: 'all .15s',
                borderRadius: isRtl ? '10px 0 0 10px' : '0 10px 10px 0',
                marginBottom: 2,
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
        >
            <span style={{ fontSize: 16, filter: active ? 'none' : 'grayscale(0.6)' }}>{icon}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
                <span style={{
                    width: 8, height: 8, background: C.red,
                    borderRadius: '50%', boxShadow: `0 0 6px ${C.red}`,
                }} />
            )}
        </button>
    );
}
function Sidebar({ items, currentUrl, role, lang, setLang, t, user, notificationsCount, alertesCount }) {
    const isRtl = lang === 'ar';
    const initials = [user?.prenom?.[0], user?.nom?.[0]].filter(Boolean).join('').toUpperCase() || 'R';

    return (
        <aside style={{
            width: 230,
            background: `linear-gradient(180deg, ${C.sidebar} 0%, #0F1535 100%)`,
            borderRight: isRtl ? 'none' : `1px solid ${C.sidebarBorder}`,
            borderLeft:  isRtl ? `1px solid ${C.sidebarBorder}` : 'none',
            display: 'flex', flexDirection: 'column',
            position: 'fixed',
            left: isRtl ? 'auto' : 0,
            right: isRtl ? 0 : 'auto',
            top: 0, bottom: 0, zIndex: 100,
            overflowY: 'auto',
        }}>
            <div style={{ padding: '20px 18px 14px', borderBottom: `1px solid ${C.sidebarBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 38, height: 38,
                        background: 'linear-gradient(135deg, #818CF8, #A78BFA)',
                        borderRadius: 10, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 18,
                        boxShadow: '0 4px 15px rgba(129,140,248,0.4)',
                    }}>🏥</div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>MediGestion</div>
                        <div style={{ fontSize: 10, color: C.textHint }}>{t.system}</div>
                    </div>
                </div>
                <div style={{
                    marginTop: 10, fontSize: 10, fontWeight: 700,
                    color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em',
                    background: C.blueSoft, borderRadius: 6,
                    padding: '3px 8px', display: 'inline-block',
                    border: '1px solid rgba(129,140,248,0.25)',
                }}>{role}</div>
            </div>
            <div style={{ padding: '10px 18px', borderBottom: `1px solid ${C.sidebarBorder}`, display: 'flex', gap: 6 }}>
                {['fr', 'en', 'ar'].map(l => (
                    <button key={l} onClick={() => setLang(l)} style={{
                        flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 700,
                        border: `1px solid ${lang === l ? C.blue : C.border}`,
                        borderRadius: 7,
                        background: lang === l
                            ? 'linear-gradient(135deg,#818CF8,#A78BFA)'
                            : 'rgba(255,255,255,0.04)',
                        color: lang === l ? '#0F1535' : C.textMuted,
                        cursor: 'pointer', transition: 'all .15s', textTransform: 'uppercase',
                    }}>{l}</button>
                ))}
            </div>

            <nav style={{ flex: 1, paddingTop: 10, paddingRight: isRtl ? 0 : 8, paddingLeft: isRtl ? 8 : 0 }}>
                <div style={{
                    padding: '6px 18px 6px', fontSize: 10, fontWeight: 700,
                    color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.08em',
                    textAlign: isRtl ? 'right' : 'left',
                }}>{t.menu}</div>
                {items.map(item => {
                    const hasBadge =
                        (item.key === 'notifications' && notificationsCount > 0) ||
                        (item.key === 'alertes' && alertesCount > 0);
                    return (
                        <SidebarItem
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            active={currentUrl === item.href || currentUrl.startsWith(item.href + '/')}
                            badge={hasBadge}
                            isRtl={isRtl}
                            onClick={() => router.visit(item.href)}
                        />
                    );
                })}
            </nav>
            <div style={{ padding: '12px 18px', borderTop: `1px solid ${C.sidebarBorder}` }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                    background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 10px',
                    border: `1px solid ${C.border}`,
                }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#818CF8,#A78BFA)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800, color: '#0F1535', flexShrink: 0,
                    }}>{initials}</div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            fontSize: 13, fontWeight: 700, color: C.text,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{user?.prenom} {user?.nom}</div>
                        <div style={{ fontSize: 11, color: C.textHint }}>
                            {user?.role === 'responsable' ? t.responsableRole : 'Patient'}
                        </div>
                    </div>
                </div>
                <button onClick={() => router.post('/logout')} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px',
                    background: 'rgba(248,113,113,0.08)',
                    border: `1px solid rgba(248,113,113,0.20)`,
                    borderRadius: 8, color: C.red,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
                }}>
                    <span>↩</span> {t.logout}
                </button>
            </div>
        </aside>
    );
}
export default function AppLayout({ children }) {
    const { auth, flash, notificationsCount = 0, alertesCount = 0 } = usePage().props;
    const [lang, setLangState] = useState(() => {
        try { return localStorage.getItem('lang') || 'fr'; } catch { return 'fr'; }
    });

    const currentUrl = window.location.pathname;
    const t = text[lang] || text.fr;
    const isRtl = lang === 'ar';
    const isResponsable = auth?.user?.role === 'responsable';
    const user = auth?.user;

    const setLang = (next) => {
        try { localStorage.setItem('lang', next); } catch {}
        setLangState(next);
    };

    const responsableItems = [
        { key: 'dashboard',   icon: '📊', label: t.dashboard,    href: '/responsable/dashboard' },
        { key: 'patients',    icon: '👥', label: t.patients,     href: '/responsable/patients' },
        { key: 'ordonnances', icon: '📄', label: t.ordonnances,  href: '/responsable/ordonnances' },
        { key: 'medicaments', icon: '💊', label: t.medicaments,  href: '/responsable/medicaments' },
        { key: 'medecins',    icon: '🩺', label: t.medecins,     href: '/responsable/medecins' },
        { key: 'alertes',     icon: '🔔', label: t.alertes,      href: '/responsable/alertes' },
        { key: 'historique',  icon: '📈', label: t.historique,   href: '/responsable/historique' },
        { key: 'profil',      icon: '👤', label: t.profil,       href: '/responsable/profil' },
    ];

    const patientItems = [
        { key: 'dashboard',     icon: '📊', label: t.dashboard,     href: '/patient/dashboard' },
        { key: 'notifications', icon: '🔔', label: t.notifications, href: '/patient/notifications' },
        { key: 'sos',           icon: '🆘', label: t.sos,           href: '/patient/sos' },
        { key: 'profil',        icon: '👤', label: t.profil,        href: '/patient/profil' },
    ];

    const items = isResponsable ? responsableItems : patientItems;
    const role  = isResponsable ? t.responsableRole : t.patientRole;

    return (
        <div style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: `radial-gradient(ellipse at 20% 50%, rgba(129,140,248,0.08) 0%, transparent 60%),
                         radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.06) 0%, transparent 50%),
                         ${C.bg}`,
            minHeight: '100vh',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            direction: isRtl ? 'rtl' : 'ltr',
        }}>
            <Sidebar
                items={items}
                currentUrl={currentUrl}
                role={role}
                lang={lang}
                setLang={setLang}
                t={t}
                user={user}
                notificationsCount={notificationsCount}
                alertesCount={alertesCount}
            />

            <main style={{
                marginLeft:  isRtl ? 0 : 230,
                marginRight: isRtl ? 230 : 0,
                padding: 28,
                height: '100vh',
                overflowY: 'auto',
                flex: 1,
                boxSizing: 'border-box',
            }}>
                {children}
            </main>

            <Toast flash={flash} />
        </div>
    );
}
