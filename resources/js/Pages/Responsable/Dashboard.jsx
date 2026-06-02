import { usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from "../../hooks/useLang";

const C = {
    bg: '#0F1535', bgCard: 'rgba(255,255,255,0.07)', bgCardHover: 'rgba(255,255,255,0.11)',
    blue: '#818CF8', blueSoft: 'rgba(129,140,248,0.15)',
    green: '#34D399', greenSoft: 'rgba(52,211,153,0.15)',
    red: '#F87171', redSoft: 'rgba(248,113,113,0.15)',
    yellow: '#FBBF24', yellowSoft: 'rgba(251,191,36,0.15)',
    purple: '#A78BFA', purpleSoft: 'rgba(167,139,250,0.15)',
    text: '#F1F5F9', textMuted: '#94A3B8', textHint: '#475569',
    border: 'rgba(255,255,255,0.10)', borderLight: 'rgba(255,255,255,0.05)',
};

const glass = {
    backgroundColor: C.bgCard,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
};

const th = {
    textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700,
    color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: `1px solid ${C.border}`,
};
const td = { padding: '12px 16px', fontSize: 14, borderBottom: `1px solid ${C.borderLight}`, verticalAlign: 'middle', color: C.text };

const text = {
    fr: {
        titre: 'Tableau de bord',
        patients: 'Patients', total: 'Total',
        ordonnances_actives: 'Ordonnances actives', actuelles: 'Actuelles',
        alertes: 'Alertes', aujourdhui: "Aujourd'hui",
        stock: 'Médicaments en stock', total_unites: 'Total unités',
        ordonnances_recentes: 'Ordonnances actives récentes',
        patient: 'Patient', medecin: 'Médecin', date: 'Date', medicaments: 'Médicaments',
        aucune_ordonnance: 'Aucune ordonnance active.',
        suivi: 'Suivi des prises (30j)',
        prises_label: 'Prises', oubliees_label: 'Oubliées',
        prises_manquees: "Prises manquées aujourd'hui",
        aucune_manquee: '✅ Aucune prise manquée !',
        stock_faible: 'Stock faible (<10)',
        stock_ok: '✅ Tous les stocks sont OK.',
        stock_label: 'Stock :',
    },
    en: {
        titre: 'Dashboard',
        patients: 'Patients', total: 'Total',
        ordonnances_actives: 'Active Prescriptions', actuelles: 'Current',
        alertes: 'Alerts', aujourdhui: 'Today',
        stock: 'Medications in stock', total_unites: 'Total units',
        ordonnances_recentes: 'Recent active prescriptions',
        patient: 'Patient', medecin: 'Doctor', date: 'Date', medicaments: 'Medications',
        aucune_ordonnance: 'No active prescriptions.',
        suivi: 'Dose tracking (30d)',
        prises_label: 'Taken', oubliees_label: 'Missed',
        prises_manquees: 'Missed doses today',
        aucune_manquee: '✅ No missed doses!',
        stock_faible: 'Low stock (<10)',
        stock_ok: '✅ All stocks are OK.',
        stock_label: 'Stock:',
    },
    ar: {
        titre: 'لوحة التحكم',
        patients: 'المرضى', total: 'المجموع',
        ordonnances_actives: 'الوصفات النشطة', actuelles: 'الحالية',
        alertes: 'التنبيهات', aujourdhui: 'اليوم',
        stock: 'الأدوية في المخزون', total_unites: 'إجمالي الوحدات',
        ordonnances_recentes: 'الوصفات النشطة الأخيرة',
        patient: 'المريض', medecin: 'الطبيب', date: 'التاريخ', medicaments: 'الأدوية',
        aucune_ordonnance: 'لا توجد وصفات نشطة.',
        suivi: 'متابعة الجرعات (30 يوم)',
        prises_label: 'مأخوذة', oubliees_label: 'منسية',
        prises_manquees: 'الجرعات الفائتة اليوم',
        aucune_manquee: '✅ لا توجد جرعات فائتة!',
        stock_faible: 'مخزون منخفض (<10)',
        stock_ok: '✅ جميع المخزونات بخير.',
        stock_label: 'المخزون:',
    },
};

function Donut({ val, t }) {
    const r = 40, circ = 2 * Math.PI * r;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width={100} height={100} viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(248,113,113,0.25)" strokeWidth={13} />
                <circle cx={50} cy={50} r={r} fill="none"
                    stroke="url(#donutGrad)" strokeWidth={13}
                    strokeDasharray={`${(val / 100) * circ} ${circ}`}
                    strokeLinecap="round" transform="rotate(-90 50 50)" />
                <defs>
                    <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                </defs>
                <text x={50} y={55} textAnchor="middle" fontSize={16} fontWeight="800" fill={C.text}>{val}%</text>
            </svg>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: 'linear-gradient(135deg,#818CF8,#34D399)' }} />
                    <span style={{ fontSize: 12, color: C.textMuted }}>{t.prises_label} ({val}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: 'rgba(248,113,113,0.5)' }} />
                    <span style={{ fontSize: 12, color: C.textMuted }}>{t.oubliees_label} ({100 - val}%)</span>
                </div>
            </div>
        </div>
    );
}

export default function ResponsableDashboard() {
    const { stats = {}, adherence = 0, alertes = [], stockFaible = [], ordonnances = [] } = usePage().props;
    const lang = useLang();
    const t = text[lang] || text.fr;

    const statCards = [
        { n: stats.patients ?? 0,             label: t.patients,            sub: t.total,         icon: '👥', from: '#818CF8', to: '#6366F1' },
        { n: stats.ordonnances_actives ?? 0,  label: t.ordonnances_actives, sub: t.actuelles,     icon: '📄', from: '#34D399', to: '#059669' },
        { n: stats.alertes_non_traitees ?? 0, label: t.alertes,             sub: t.aujourdhui,    icon: '🚨', from: '#F87171', to: '#DC2626' },
        { n: stats.stock_total ?? 0,          label: t.stock,               sub: t.total_unites,  icon: '💊', from: '#FBBF24', to: '#D97706' },
    ];

    const dateLocale = lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR';

    return (
        <AppLayout>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: C.text }}>{t.titre}</h1>
                <p style={{ fontSize: 14, color: C.textMuted, margin: '4px 0 0', textTransform: 'capitalize' }}>
                    {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{ ...glass, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 46, height: 46, borderRadius: 12,
                            background: `linear-gradient(135deg, ${s.from}25, ${s.to}15)`,
                            border: `1px solid ${s.from}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                            boxShadow: `0 4px 15px ${s.from}20`,
                        }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 26, fontWeight: 900, background: `linear-gradient(135deg,${s.from},${s.to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: C.textHint }}>{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 16 }}>
                <div style={{ ...glass, padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: C.text }}>{t.ordonnances_recentes}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>{[t.patient, t.medecin, t.date, t.medicaments].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                        <tbody>
                            {ordonnances.map((o, i) => (
                                <tr key={i}>
                                    <td style={{ ...td, fontWeight: 600 }}>{o.patient}</td>
                                    <td style={{ ...td, fontSize: 12, color: C.textMuted }}>{o.medecin}</td>
                                    <td style={td}>{o.date}</td>
                                    <td style={{ ...td, fontSize: 12 }}>{o.medicaments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {ordonnances.length === 0 && <p style={{ textAlign: 'center', color: C.textMuted, padding: 16 }}>{t.aucune_ordonnance}</p>}
                </div>
                <div style={{ ...glass, padding: 20, minWidth: 230 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.text }}>{t.suivi}</h3>
                    <Donut val={adherence} t={t} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ ...glass, padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: C.text }}>{t.prises_manquees}</h3>
                    {alertes.length === 0
                        ? <p style={{ color: C.green, textAlign: 'center', fontWeight: 600 }}>{t.aucune_manquee}</p>
                        : alertes.map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < alertes.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
                                <span style={{ color: C.red }}>⚠️</span>
                                <span style={{ fontSize: 13, color: C.textMuted }}>{a.patient} — {a.medicament} à {a.heure}</span>
                            </div>
                        ))
                    }
                </div>
                <div style={{ ...glass, padding: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: C.text }}>{t.stock_faible}</h3>
                    {stockFaible.length === 0
                        ? <p style={{ color: C.green, textAlign: 'center', fontWeight: 600 }}>{t.stock_ok}</p>
                        : stockFaible.map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < stockFaible.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span>💊</span><span style={{ fontSize: 13, color: C.text }}>{s.nom_commercial}</span></div>
                                <span style={{ fontSize: 12, color: C.red, fontWeight: 700 }}>{t.stock_label} {s.quantite_stock}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </AppLayout>
    );
}
