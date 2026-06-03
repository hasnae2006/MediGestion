import { usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const th = {
    textAlign: 'left', padding: '10px 12px', fontSize: 12,
    color: 'var(--muted)', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const td = {
    padding: '12px', fontSize: 14,
    borderTop: '1px solid var(--line)',
    verticalAlign: 'middle', color: 'var(--text)',
};

const statutStyles = {
    pris:       { bg: 'rgba(20,184,166,0.1)',   color: 'var(--teal)',  label: { fr: '✅ Pris',       en: '✅ Taken',   ar: '✅ تم الأخذ'     } },
    en_attente: { bg: 'rgba(245,158,11,.1)',     color: 'var(--amber)', label: { fr: '⏰ En attente', en: '⏰ Pending', ar: '⏰ في الانتظار'  } },
    manque:     { bg: 'rgba(239,68,68,.08)',     color: 'var(--red)',   label: { fr: '❌ Manqué',     en: '❌ Missed',  ar: '❌ فائت'         } },
    reporte:    { bg: 'rgba(99,102,241,0.1)',    color: 'var(--blue)',  label: { fr: '🔄 Reporté',    en: '🔄 Delayed', ar: '🔄 مؤجل'         } },
};

const histText = {
    fr: { titre: '📊 Historique des prises', prise: 'prise(s)', patient: 'Patient', medicament: 'Médicament', date: 'Date', heure_prevue: 'Heure prévue', heure_reelle: 'Heure réelle', statut: 'Statut', aucune: 'Aucune prise trouvée' },
    en: { titre: '📊 Medication History', prise: 'dose(s)', patient: 'Patient', medicament: 'Medication', date: 'Date', heure_prevue: 'Scheduled Time', heure_reelle: 'Actual Time', statut: 'Status', aucune: 'No doses found' },
    ar: { titre: '📊 سجل الجرعات', prise: 'جرعة', patient: 'المريض', medicament: 'الدواء', date: 'التاريخ', heure_prevue: 'الوقت المحدد', heure_reelle: 'الوقت الفعلي', statut: 'الحالة', aucune: 'لا توجد جرعات' },
};

export default function Historique({ prises = { data: [], total: 0 } }) {
    const lang = useLang();
    const t = histText[lang] || histText.fr;
    const data = prises?.data || [];

    return (
        <AppLayout>
            <header style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.titre}</h1>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>{prises?.total || 0} {t.prise}</p>
            </header>

            <div style={{ ...cardStyle, overflowX: 'auto', padding: 20 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                    <thead>
                        <tr>
                            {[t.patient, t.medicament, t.date, t.heure_prevue, t.heure_reelle, t.statut].map(h => (
                                <th key={h} style={th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && (
                            <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>{t.aucune}</td></tr>
                        )}
                        {data.map((p, i) => {
                            const s = statutStyles[p.statut] || statutStyles.en_attente;
                            return (
                                <tr key={i}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--panel-soft)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ ...td, fontWeight: 800 }}>{p.patient}</td>
                                    <td style={td}>{p.medicament}</td>
                                    <td style={{ ...td, color: 'var(--muted)' }}>{p.date}</td>
                                    <td style={{ ...td, fontWeight: 800, color: 'var(--blue)' }}>{p.heure}</td>
                                    <td style={{ ...td, color: 'var(--muted)' }}>{p.heure_reelle || '—'}</td>
                                    <td style={td}>
                                        <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                                            {s.label[lang] || s.label.fr}
                                        </span>
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