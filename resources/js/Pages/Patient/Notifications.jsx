import AppLayout from '../Layout';  // ✅ un seul ../
import { Link } from '@inertiajs/react';

const typeColors = {
    rappel:       { bg: '#EFF6FF', color: '#1D4ED8', label: '💊 Rappel' },
    confirmation: { bg: '#F0FDF4', color: '#15803D', label: '✅ Confirmé' },
    alerte:       { bg: '#FEF2F2', color: '#DC2626', label: '🚨 Alerte' },
    info:         { bg: '#F8FAFC', color: '#475569', label: 'ℹ️ Info' },
};

export default function Notifications({ notifications }) {
    return (
        <AppLayout>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🔔 Notifications</h1>

            {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>
                    <div style={{ fontSize: 48 }}>🎉</div>
                    <p style={{ marginTop: 12 }}>Aucune notification</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {notifications.map(n => {
                        const style = typeColors[n.type] || typeColors.info;
                        return (
                            <div key={n.id} style={{
                                backgroundColor: n.lu ? '#F8FAFC' : style.bg,
                                border: `1px solid ${n.lu ? '#E2E8F0' : '#BFDBFE'}`,
                                borderRadius: 10,
                                padding: '14px 18px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                            }}>
                                <div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700,
                                        color: style.color,
                                        backgroundColor: style.bg,
                                        padding: '2px 8px', borderRadius: 20,
                                        marginBottom: 6, display: 'inline-block'
                                    }}>
                                        {style.label}
                                    </span>
                                    <div style={{ fontWeight: n.lu ? 500 : 700, fontSize: 14, color: '#1E293B' }}>
                                        {n.titre}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                                        {n.message}
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap', marginLeft: 16 }}>
                                    {n.date}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}