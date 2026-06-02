import { useState } from 'react';
import { router } from '@inertiajs/react';
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

const th = {
    textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700,
    color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: `1px solid ${C.border}`,
};

const td = {
    padding: '12px 16px', fontSize: 14,
    borderBottom: `1px solid ${C.borderLight}`,
    verticalAlign: 'middle', color: C.text,
};

const statutStylesHist = {
    pris:       { bg: 'rgba(52,211,153,0.15)',  color: '#34D399', label: { fr: '✅ Pris', en: '✅ Taken', ar: '✅ تم الأخذ' }},
    en_attente: { bg: 'rgba(251,191,36,0.15)',  color: '#FBBF24', label: { fr: '⏰ En attente', en: '⏰ Pending', ar: '⏰ في الانتظار' }},
    manque:     { bg: 'rgba(248,113,113,0.15)', color: '#F87171', label: { fr: '❌ Manqué', en: '❌ Missed', ar: '❌ فائت' }},
    reporte:    { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA', label: { fr: '🔄 Reporté', en: '🔄 Delayed', ar: '🔄 مؤجل' }},
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
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>{t.titre}</h1>
                <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{prises?.total || 0} {t.prise}</p>
            </div>
            <div style={glass({ overflow: 'hidden', padding: 0 })}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            <th style={th}>{t.patient}</th>
                            <th style={th}>{t.medicament}</th>
                            <th style={th}>{t.date}</th>
                            <th style={th}>{t.heure_prevue}</th>
                            <th style={th}>{t.heure_reelle}</th>
                            <th style={th}>{t.statut}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>{t.aucune}</td>
                            </tr>
                        )}
                        {data.map((p, i) => {
                            const s = statutStylesHist[p.statut] || statutStylesHist.en_attente;
                            return (
                                <tr key={i} style={{ transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ ...td, fontWeight: 600 }}>{p.patient}</td>
                                    <td style={td}>{p.medicament}</td>
                                    <td style={{ ...td, color: C.textMuted }}>{p.date}</td>
                                    <td style={{ ...td, fontWeight: 600, color: C.blue }}>{p.heure}</td>
                                    <td style={{ ...td, color: C.textMuted }}>{p.heure_reelle || '—'}</td>
                                    <td style={td}>
                                        <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
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