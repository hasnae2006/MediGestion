import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';
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
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    ...extra,
});

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
    rappel:       { bg: C.blueSoft, color: C.blue, border: C.blue },
    confirmation: { bg: C.greenSoft, color: C.green, border: C.green },
    alerte:       { bg: C.redSoft, color: C.red, border: C.red },
    info:         { bg: 'rgba(255,255,255,0.04)', color: C.textMuted, border: C.border },
};

export default function Notifications({ notifications = [] }) {
    const lang = useLang();
    const t = text[lang] || text.fr;
    const isRtl = lang === 'ar';

    return (
        <AppLayout>
            <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: C.text }}>{t.titre}</h1>
                <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>
                    {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                </p>

                {notifications.length === 0 ? (
                    <div style={{ ...glass({ textAlign: 'center', padding: 60 }) }}>
                        <div style={{ fontSize: 48 }}>🔔</div>
                        <p style={{ marginTop: 12, color: C.textMuted }}>{t.aucune}</p>
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
                                        ...glass({ padding: '16px 20px' }),
                                        backgroundColor: isLu ? C.bgCard : style.bg,
                                        borderLeft: `3px solid ${style.color}`,
                                        transition: 'all 0.2s',
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
                                                    fontSize: 11, 
                                                    fontWeight: 700, 
                                                    color: style.color, 
                                                    backgroundColor: style.bg,
                                                    padding: '3px 10px', 
                                                    borderRadius: 20,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                }}>
                                                    {label.split(' ')[0]} {label.split(' ')[1] || ''}
                                                </span>
                                                {!isLu && (
                                                    <span style={{
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        color: C.blue,
                                                        backgroundColor: C.blueSoft,
                                                        padding: '2px 8px',
                                                        borderRadius: 20,
                                                    }}>
                                                        {t.non_lue}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ 
                                                fontWeight: isLu ? 500 : 700, 
                                                fontSize: 15, 
                                                color: C.text,
                                                marginBottom: 4,
                                            }}>
                                                {n.titre}
                                            </div>
                                            <div style={{ 
                                                fontSize: 13, 
                                                color: C.textMuted, 
                                                lineHeight: 1.5,
                                            }}>
                                                {n.message}
                                            </div>
                                        </div>
                                        <div style={{ 
                                            fontSize: 12, 
                                            color: C.textHint, 
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                        }}>
                                            {n.date}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}