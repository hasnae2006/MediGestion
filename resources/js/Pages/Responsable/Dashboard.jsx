import { usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', primaryLight: '#2D5A9E', accent: '#10B981',
    danger: '#EF4444', warning: '#F59E0B', white: '#FFFFFF',
    text: '#1E293B', textMuted: '#64748B', border: '#E2E8F0',
};
const card = { backgroundColor: colors.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 16 };
const th   = { textAlign: 'left', padding: '10px 14px', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', borderBottom: `2px solid ${colors.border}` };
const td   = { padding: '10px 14px', fontSize: 14, borderBottom: `1px solid ${colors.border}`, verticalAlign: 'middle' };

// Donut SVG
function Donut({ val }) {
    const r = 40, circ = 2 * Math.PI * r;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width={100} height={100} viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={r} fill="none" stroke="#FEE2E2" strokeWidth={14} />
                <circle cx={50} cy={50} r={r} fill="none" stroke="#10B981" strokeWidth={14}
                    strokeDasharray={`${(val / 100) * circ} ${circ}`}
                    strokeLinecap="round" transform="rotate(-90 50 50)" />
                <text x={50} y={55} textAnchor="middle" fontSize={16} fontWeight="700" fill={colors.text}>{val}%</text>
            </svg>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#10B981' }} />
                    <span style={{ fontSize: 12 }}>Prises ({val}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FCA5A5' }} />
                    <span style={{ fontSize: 12 }}>Oubliées ({100 - val}%)</span>
                </div>
            </div>
        </div>
    );
}

export default function ResponsableDashboard() {
    const { stats = {}, adherence = 0, alertes = [], stockFaible = [], ordonnances = [] } = usePage().props;

    const statCards = [
        { n: stats.patients ?? 0,             label: 'Patients',            sub: 'Total',        icon: '👥', color: '#3B82F6' },
        { n: stats.ordonnances_actives ?? 0,  label: 'Ordonnances actives', sub: 'Actuelles',    icon: '📄', color: '#10B981' },
        { n: stats.alertes_non_traitees ?? 0, label: 'Alertes',             sub: "Aujourd'hui",  icon: '🚨', color: '#EF4444' },
        { n: stats.stock_total ?? 0,          label: 'Médicaments en stock',sub: 'Total unités', icon: '💊', color: '#F59E0B' },
    ];

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Tableau de bord</h1>
                    <p style={{ fontSize: 14, color: colors.textMuted, margin: '4px 0 0', textTransform: 'capitalize' }}>
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{ backgroundColor: colors.white, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.n}</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: colors.textMuted }}>{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ordonnances + Donut */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 16 }}>
                <div style={card}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Ordonnances actives récentes</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>{['Patient', 'Médecin', 'Date', 'Médicaments'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                        <tbody>
                            {ordonnances.map((o, i) => (
                                <tr key={i}>
                                    <td style={td}>{o.patient}</td>
                                    <td style={{ ...td, fontSize: 12, color: colors.textMuted }}>{o.medecin}</td>
                                    <td style={td}>{o.date}</td>
                                    <td style={{ ...td, fontSize: 12 }}>{o.medicaments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {ordonnances.length === 0 && <p style={{ textAlign: 'center', color: colors.textMuted, padding: 16 }}>Aucune ordonnance active.</p>}
                </div>
                <div style={{ ...card, minWidth: 220 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Suivi des prises (30j)</h3>
                    <Donut val={adherence} />
                </div>
            </div>

            {/* Alertes + Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={card}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Prises manquées aujourd'hui</h3>
                    {alertes.length === 0
                        ? <p style={{ color: colors.accent, textAlign: 'center' }}>✅ Aucune prise manquée !</p>
                        : alertes.map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < alertes.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                                <span style={{ color: colors.danger }}>⚠️</span>
                                <span style={{ fontSize: 13 }}>{a.patient} — {a.medicament} à {a.heure}</span>
                            </div>
                        ))
                    }
                </div>
                <div style={card}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Stock faible (&lt;10)</h3>
                    {stockFaible.length === 0
                        ? <p style={{ color: colors.accent, textAlign: 'center' }}>✅ Tous les stocks sont OK.</p>
                        : stockFaible.map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < stockFaible.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span>💊</span><span style={{ fontSize: 13 }}>{s.nom_commercial}</span></div>
                                <span style={{ fontSize: 12, color: colors.danger, fontWeight: 700 }}>Stock : {s.quantite_stock}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </AppLayout>
    );
}
