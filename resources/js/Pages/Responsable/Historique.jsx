import { usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', accent: '#10B981', danger: '#EF4444',
    white: '#FFFFFF', textMuted: '#64748B', border: '#E2E8F0',
};

const statutStyles = {
    pris:       { bg: '#D1FAE5', color: '#065F46', label: '✅ Pris' },
    en_attente: { bg: '#FEF3C7', color: '#D97706', label: '⏰ En attente' },
    manque:     { bg: '#FEE2E2', color: '#DC2626', label: '❌ Manqué' },
    reporte:    { bg: '#EDE9FE', color: '#6D28D9', label: '🔄 Reporté' },
};

export default function Historique({ prises }) {
    const data = prises?.data || [];

    return (
        <AppLayout>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>📊 Historique des prises</h1>
                <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>{prises?.total || 0} prise(s)</p>
            </div>

            <div style={{ backgroundColor: colors.white, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F8FAFC' }}>
                            {['Patient', 'Médicament', 'Date', 'Heure prévue', 'Heure réelle', 'Statut'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: colors.textMuted }}>Aucune prise trouvée</td>
                            </tr>
                        )}
                        {data.map((p, i) => {
                            const style = statutStyles[p.statut] || statutStyles.en_attente;
                            return (
                                <tr key={i} style={{ borderTop: `1px solid ${colors.border}` }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.patient}</td>
                                    <td style={{ padding: '12px 16px' }}>{p.medicament}</td>
                                    <td style={{ padding: '12px 16px', color: colors.textMuted }}>{p.date}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, color: colors.primary }}>{p.heure}</td>
                                    <td style={{ padding: '12px 16px', color: colors.textMuted }}>{p.heure_reelle || '—'}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ backgroundColor: style.bg, color: style.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{style.label}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
