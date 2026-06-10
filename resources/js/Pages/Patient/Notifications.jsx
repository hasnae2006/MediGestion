import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const text = {
    fr: {
        titre: '🔔 Notifications', aucune: 'Aucune notification',
        types: { rappel: '💊 Rappel', confirmation: '✅ Confirmé', alerte: '🚨 Alerte', info: 'ℹ️ Info' },
        lue: 'Lue', non_lue: 'Non lue',
    },
    en: {
        titre: '🔔 Notifications', aucune: 'No notifications',
        types: { rappel: '💊 Reminder', confirmation: '✅ Confirmed', alerte: '🚨 Alert', info: 'ℹ️ Info' },
        lue: 'Read', non_lue: 'Unread',
    },
    ar: {
        titre: '🔔 الإشعارات', aucune: 'لا توجد إشعارات',
        types: { rappel: '💊 تذكير', confirmation: '✅ تأكيد', alerte: '🚨 تنبيه', info: 'ℹ️ معلومات' },
        lue: 'مقروء', non_lue: 'غير مقروء',
    },
};

const typeStyles = {
    rappel:       { bg: 'rgba(99,102,241,0.1)',  color: 'var(--blue)',  border: 'var(--blue)'  },
    confirmation: { bg: 'rgba(20,184,166,0.1)',  color: 'var(--teal)',  border: 'var(--teal)'  },
    alerte:       { bg: 'rgba(239,68,68,.08)',   color: 'var(--red)',   border: 'var(--red)'   },
    info:         { bg: 'var(--panel-soft)',      color: 'var(--muted)', border: 'var(--line)'  },
};

export default function Notifications({ notifications = [] }) {
    const lang = useLang();
    const t = text[lang] || text.fr;
    const isRtl = lang === 'ar';

    return (
        <AppLayout>
            {/* ✅ Wrapper scrollable */}
            <div style={{
                height: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '24px',
                boxSizing: 'border-box',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--line) transparent',
                direction: isRtl ? 'rtl' : 'ltr',
            }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.titre}</h1>
                        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
                            {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                        </p>
                    </div>
                </header>

                {notifications.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
                        <div style={{ fontSize: 48 }}>🔔</div>
                        <p style={{ color: 'var(--muted)', marginTop: 12 }}>{t.aucune}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {notifications.map(n => {
                            const style = typeStyles[n.type] || typeStyles.info;
                            const label = t.types[n.type] || t.types.info;
                            const isLu = n.lu === 1 || n.lu === true;

                            return (
                                <div
                                    key={n.id}
                                    style={{
                                        ...cardStyle,
                                        padding: 20,
                                        backgroundColor: isLu ? 'var(--panel)' : style.bg,
                                        borderLeft: `3px solid ${style.color}`,
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: 12,
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                marginBottom: 8,
                                                flexWrap: 'wrap',
                                            }}>
                                                <span style={{
                                                    background: style.bg,
                                                    color: style.color,
                                                    padding: '2px 10px',
                                                    borderRadius: 20,
                                                    fontSize: 12,
                                                    fontWeight: 800,
                                                }}>
                                                    {label}
                                                </span>
                                                {!isLu && (
                                                    <span style={{
                                                        background: 'rgba(99,102,241,0.1)',
                                                        color: 'var(--blue)',
                                                        padding: '2px 10px',
                                                        borderRadius: 20,
                                                        fontSize: 12,
                                                        fontWeight: 800,
                                                    }}>
                                                        {t.non_lue}
                                                    </span>
                                                )}
                                                <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 'auto' }}>{n.date}</span>
                                            </div>
                                            <div style={{
                                                fontWeight: isLu ? 600 : 900,
                                                fontSize: 15,
                                                color: 'var(--text)',
                                                marginBottom: 4,
                                            }}>
                                                {n.titre}
                                            </div>
                                            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>{/* fin wrapper scrollable */}
        </AppLayout>
    );
}
