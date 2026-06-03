import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const translations = {
    fr: {
        system: 'Gestion médicale',
        logout: 'Déconnexion',
        responsableRole: 'Espace responsable',
        patientRole: 'Espace patient',
        dashboard: 'Tableau de bord',
        patients: 'Patients',
        ordonnances: 'Ordonnances',
        medicaments: 'Médicaments',
        medecins: 'Médecins',
        alertes: 'Alertes',
        historique: 'Historique',
        notifications: 'Notifications',
        sos: 'SOS / Urgence',
        profil: 'Mon profil',
        menu: 'Navigation',
    },
    en: {
        system: 'Medical management',
        logout: 'Log out',
        responsableRole: 'Manager area',
        patientRole: 'Patient area',
        dashboard: 'Dashboard',
        patients: 'Patients',
        ordonnances: 'Prescriptions',
        medicaments: 'Medicines',
        medecins: 'Doctors',
        alertes: 'Alerts',
        historique: 'History',
        notifications: 'Notifications',
        sos: 'SOS / Emergency',
        profil: 'My profile',
        menu: 'Navigation',
    },
    ar: {
        system: 'إدارة طبية',
        logout: 'تسجيل الخروج',
        responsableRole: 'فضاء المسؤول',
        patientRole: 'فضاء المريض',
        dashboard: 'لوحة التحكم',
        patients: 'المرضى',
        ordonnances: 'الوصفات',
        medicaments: 'الأدوية',
        medecins: 'الأطباء',
        alertes: 'التنبيهات',
        historique: 'السجل',
        notifications: 'الإشعارات',
        sos: 'طوارئ',
        profil: 'ملفي الشخصي',
        menu: 'القائمة',
    },
};

const icons = {
    dashboard:     'TB',
    patients:      'PT',
    ordonnances:   'OR',
    medicaments:   'RX',
    medecins:      'DR',
    alertes:       'AL',
    historique:    'HI',
    notifications: 'NO',
    sos:           'SOS',
    profil:        'PR',
};

function Toast({ flash }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = window.setTimeout(() => setVisible(false), 3000);
            return () => window.clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    return (
        <div className={`toast ${flash.success ? 'success' : 'error'}`}>
            {flash.success || flash.error}
        </div>
    );
}

function SidebarItem({ item, active, badge }) {
    return (
        <button
            type="button"
            className={`nav-item ${active ? 'is-active' : ''}`}
            onClick={() => router.visit(item.href)}
        >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {badge && <span className="badge-dot" aria-label="nouveau" />}
        </button>
    );
}

function Sidebar({ items, currentUrl, roleLabel, lang, setLang, t, user, notificationsCount, alertesCount }) {
    const initials     = [user?.prenom?.[0], user?.nom?.[0]].filter(Boolean).join('').toUpperCase() || 'MG';
    const displayName  = [user?.prenom, user?.nom].filter(Boolean).join(' ') || 'Utilisateur';

    return (
        <aside className="app-sidebar" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
        }}>
            {/* Brand */}
            <div className="brand" style={{ flexShrink: 0 }}>
                <div className="brand-mark">MG</div>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 900 }}>MediGestion</div>
                    <div style={{ color: 'rgba(255,255,255,.56)', fontSize: 12 }}>{t.system}</div>
                </div>
            </div>
            <div className="lang-switch" style={{ flexShrink: 0 }}>
                {['fr', 'en', 'ar'].map((code) => (
                    <button
                        key={code}
                        type="button"
                        className={lang === code ? 'is-active' : ''}
                        onClick={() => setLang(code)}
                    >
                        {code.toUpperCase()}
                    </button>
                ))}
            </div>
            <nav style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                /* hide scrollbar visually but keep functionality */
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                <style>{`
                    .app-sidebar nav::-webkit-scrollbar { display: none; }
                `}</style>
                <div className="nav-label">{t.menu}</div>
                {items.map((item) => {
                    const hasBadge =
                        (item.key === 'notifications' && notificationsCount > 0) ||
                        (item.key === 'alertes'       && alertesCount > 0);

                    return (
                        <SidebarItem
                            key={item.key}
                            item={item}
                            active={currentUrl === item.href || currentUrl.startsWith(`${item.href}/`)}
                            badge={hasBadge}
                        />
                    );
                })}
            </nav>
            <div className="sidebar-footer" style={{ flexShrink: 0 }}>
                <div className="user-card">
                    <div className="avatar">{initials}</div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 900 }}>
                            {displayName}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>{roleLabel}</div>
                    </div>
                </div>
                <button
                    type="button"
                    className="logout-button"
                    onClick={() => router.post('/logout')}
                >
                    {t.logout}
                </button>
            </div>
        </aside>
    );
}

export default function AppLayout({ children }) {
    const { auth, flash, notificationsCount = 0, alertesCount = 0 } = usePage().props;

    const [lang, setLangState] = useState(() => {
        try { return localStorage.getItem('lang') || 'fr'; }
        catch { return 'fr'; }
    });

    const setLang = (next) => {
        try {
            localStorage.setItem('lang', next);
            window.dispatchEvent(new CustomEvent('app:lang', { detail: next }));
        } catch {}
        setLangState(next);
    };

    const currentUrl     = window.location.pathname;
    const t              = translations[lang] || translations.fr;
    const isRtl          = lang === 'ar';
    const isResponsable  = auth?.user?.role === 'responsable';

    const responsableItems = [
        { key: 'dashboard',   icon: icons.dashboard,   label: t.dashboard,   href: '/responsable/dashboard'   },
        { key: 'patients',    icon: icons.patients,    label: t.patients,    href: '/responsable/patients'    },
        { key: 'ordonnances', icon: icons.ordonnances, label: t.ordonnances, href: '/responsable/ordonnances' },
        { key: 'medicaments', icon: icons.medicaments, label: t.medicaments, href: '/responsable/medicaments' },
        { key: 'medecins',    icon: icons.medecins,    label: t.medecins,    href: '/responsable/medecins'    },
        { key: 'alertes',     icon: icons.alertes,     label: t.alertes,     href: '/responsable/alertes'     },
        { key: 'historique',  icon: icons.historique,  label: t.historique,  href: '/responsable/historique'  },
        { key: 'profil',      icon: icons.profil,      label: t.profil,      href: '/responsable/profil'      },
    ];

    const patientItems = [
        { key: 'dashboard',     icon: icons.dashboard,     label: t.dashboard,     href: '/patient/dashboard'     },
        { key: 'notifications', icon: icons.notifications, label: t.notifications, href: '/patient/notifications' },
        { key: 'sos',           icon: icons.sos,           label: t.sos,           href: '/patient/sos'           },
        { key: 'profil',        icon: icons.profil,        label: t.profil,        href: '/patient/profil'        },
    ];

    return (
        <div className="app-shell" dir={isRtl ? 'rtl' : 'ltr'}>
            <Sidebar
                items={isResponsable ? responsableItems : patientItems}
                currentUrl={currentUrl}
                roleLabel={isResponsable ? t.responsableRole : t.patientRole}
                lang={lang}
                setLang={setLang}
                t={t}
                user={auth?.user}
                notificationsCount={notificationsCount}
                alertesCount={alertesCount}
            />
            <main className="app-main">{children}</main>
            <Toast flash={flash} />
        </div>
    );
}
