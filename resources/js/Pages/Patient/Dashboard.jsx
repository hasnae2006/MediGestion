import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
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
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    ...extra,
});
const text = {
    fr: {
        bonjour: 'Bonjour,', programme: 'Voici votre programme du jour',
        prochaine: 'Prochaine prise :', total: 'Total', aujourdhui: "Aujourd'hui",
        pris: 'Pris', bravo: 'Bravo !', a_prendre: 'À prendre', noubliez: "N'oubliez pas",
        oublies: 'Oubliés', ce_mois: 'Ce mois',
        programme_jour: 'Programme du jour', aucune_prise: "Aucune prise prévue aujourd'hui.",
        confirmer: 'Confirmer', adherence: 'Adhérence (30 jours)',
        excellent: 'Excellent suivi !', efforts: 'Des efforts à faire', pensez: 'Pensez à vos médicaments',
        mon_medecin: 'Mon médecin', appel_urgence: "Appel d'urgence",
        aucun_medecin: 'Aucun médecin assigné',
        details: 'Détails du médicament', medicament: 'Médicament', quantite: 'Quantité',
        heure: 'Heure', moment: 'Moment', statut: 'Statut',
        confirmer_prise: 'Confirmer cette prise',
        statut_pris: 'Pris', statut_attente: 'À prendre',
        sos: 'SOS',
        matin: 'Matin', midi: 'Midi', soir: 'Soir', nuit: 'Nuit',
    },
    en: {
        bonjour: 'Hello,', programme: 'Here is your daily schedule',
        prochaine: 'Next dose:', total: 'Total', aujourdhui: 'Today',
        pris: 'Taken', bravo: 'Well done!', a_prendre: 'To take', noubliez: "Don't forget",
        oublies: 'Missed', ce_mois: 'This month',
        programme_jour: 'Daily schedule', aucune_prise: 'No doses scheduled today.',
        confirmer: 'Confirm', adherence: 'Adherence (30 days)',
        excellent: 'Excellent tracking!', efforts: 'Room for improvement', pensez: 'Remember your medications',
        mon_medecin: 'My doctor', appel_urgence: 'Emergency call',
        aucun_medecin: 'No doctor assigned',
        details: 'Medication details', medicament: 'Medication', quantite: 'Quantity',
        heure: 'Time', moment: 'Moment', statut: 'Status',
        confirmer_prise: 'Confirm this dose',
        statut_pris: 'Taken', statut_attente: 'To take',
        sos: 'SOS',
        matin: 'Morning', midi: 'Noon', soir: 'Evening', nuit: 'Night',
    },
    ar: {
        bonjour: 'مرحباً،', programme: 'هذا برنامجك اليومي',
        prochaine: 'الجرعة القادمة:', total: 'المجموع', aujourdhui: 'اليوم',
        pris: 'تم الأخذ', bravo: 'أحسنت!', a_prendre: 'للأخذ', noubliez: 'لا تنسَ',
        oublies: 'منسي', ce_mois: 'هذا الشهر',
        programme_jour: 'البرنامج اليومي', aucune_prise: 'لا توجد جرعات مجدولة اليوم.',
        confirmer: 'تأكيد', adherence: 'الالتزام (30 يوم)',
        excellent: 'متابعة ممتازة!', efforts: 'يجب بذل المزيد', pensez: 'تذكر أدويتك',
        mon_medecin: 'طبيبي', appel_urgence: 'اتصال طارئ',
        aucun_medecin: 'لا يوجد طبيب معين',
        details: 'تفاصيل الدواء', medicament: 'الدواء', quantite: 'الكمية',
        heure: 'الوقت', moment: 'الوقت', statut: 'الحالة',
        confirmer_prise: 'تأكيد هذه الجرعة',
        statut_pris: 'تم', statut_attente: 'للأخذ',
        sos: 'طوارئ',
        matin: 'صباح', midi: 'ظهر', soir: 'مساء', nuit: 'ليل',
    },
};

const formeIcon = { comprime: '💊', sirop: '🧴', injectable: '💉', capsule: '🔵', autre: '💊' };

function StatutBadge({ statut, t }) {
    const styles = {
        pris:       { bg: C.greenSoft, color: C.green, icon: '✓',  label: t.pris },
        en_attente: { bg: C.yellowSoft, color: C.yellow, icon: '⏱', label: t.a_prendre },
        manque:     { bg: C.redSoft,   color: C.red, icon: '✕',  label: t.oublies },
    };
    const s = styles[statut] || { bg: C.blueSoft, color: C.blue, icon: '⏳', label: '—' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: s.bg, color: s.color,
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
            {s.icon} {s.label}
        </span>
    );
}

function ProgressBar({ value }) {
    const color = value >= 80 ? C.green : value >= 60 ? C.yellow : C.red;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textHint, marginBottom: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <div style={{ background: C.border, borderRadius: 6, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${value}%`, background: color, height: '100%', borderRadius: 6, transition: 'width 0.6s ease' }} />
            </div>
        </div>
    );
}

function Modal({ med, onClose, onConfirm, t }) {
    if (!med) return null;
    const rows = [
        { label: t.medicament, value: med.medicament,   icon: '💊' },
        { label: t.quantite,   value: med.quantite,     icon: '⚖️' },
        { label: t.heure,      value: med.heure_prevue, icon: '⏰' },
        { label: t.moment,     value: med.temps,        icon: '🕐' },
        { label: t.statut,     value: med.statut === 'en_attente' ? t.statut_attente : med.statut === 'pris' ? t.statut_pris : med.statut, icon: '📋' },
    ];
    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                ...glass({ padding: 28 }),
                maxWidth: 400, width: '90%',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{t.details}</h3>
                    <button onClick={onClose} style={{
                        border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.04)', borderRadius: 8,
                        width: 32, height: 32, cursor: 'pointer', color: C.textMuted,
                        fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    {med.photo_boite
                        ? <img src={`/storage/${med.photo_boite}`} alt={med.medicament} style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 12, border: `1px solid ${C.border}` }} />
                        : <div style={{ width: 80, height: 80, borderRadius: 16, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto' }}>
                            {formeIcon[med.forme] || '💊'}
                          </div>
                    }
                </div>

                {rows.map(item => (
                    <div key={item.label} style={{
                        display: 'flex', gap: 12, padding: '10px 0',
                        borderBottom: `0.5px solid ${C.borderLight}`,
                    }}>
                        <span style={{ fontSize: 18, width: 28, flexShrink: 0 }}>{item.icon}</span>
                        <div>
                            <div style={{ fontSize: 10, color: C.textHint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>{item.value}</div>
                        </div>
                    </div>
                ))}

                {med.statut === 'en_attente' && (
                    <button onClick={() => { onConfirm(med.id); onClose(); }} style={{
                        width: '100%', marginTop: 20, padding: 13,
                        background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white,
                        border: 'none', borderRadius: 10,
                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        transition: 'background .15s',
                    }}>
                        ✓ {t.confirmer_prise}
                    </button>
                )}
            </div>
        </div>
    );
}
export default function PatientDashboard() {
    const { auth, prises: prisesInitiales = [], adherence = 0, medecin = null, prochainePrise = null } = usePage().props;
    const lang = useLang();
    const t = text[lang] || text.fr;
    const user = auth.user;

    const [prisesState, setPrisesState] = useState(prisesInitiales);
    const [selectedMed, setSelectedMed] = useState(null);

    const confirmerPrise = (id) => {
        router.patch(`/patient/prises/${id}/confirmer`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setPrisesState(prev => prev.map(p => p.id === id ? { ...p, statut: 'pris' } : p));
                setSelectedMed(prev => prev?.id === id ? { ...prev, statut: 'pris' } : prev);
            },
        });
    };

    const dateLocale = lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR';
    const dateStr = new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const total   = prisesState.length;
    const prises  = prisesState.filter(p => p.statut === 'pris').length;
    const attente = prisesState.filter(p => p.statut === 'en_attente').length;
    const oublies = prisesState.filter(p => p.statut === 'manque').length;

    const stats = [
        { n: total,   label: t.total,     sub: t.aujourdhui, icon: '💊', color: C.blue,  bg: C.blueSoft  },
        { n: prises,  label: t.pris,      sub: t.bravo,      icon: '✓',  color: C.green, bg: C.greenSoft },
        { n: attente, label: t.a_prendre, sub: t.noubliez,   icon: '⏱', color: C.yellow, bg: C.yellowSoft },
        { n: oublies, label: t.oublies,   sub: t.ce_mois,    icon: '✕',  color: C.red,   bg: C.redSoft   },
    ];

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
                        {t.bonjour} {user?.prenom}
                    </h1>
                    <p style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>{t.programme}</p>
                    {prochainePrise && (
                        <div style={{
                            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: C.blueSoft, border: `1px solid ${C.border}`,
                            borderRadius: 8, padding: '6px 12px', fontSize: 12, color: C.blue,
                        }}>
                            ⏰ {t.prochaine} <strong>{prochainePrise.heure_prevue}</strong> — {prochainePrise.medicament}
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: C.textHint, textTransform: 'capitalize', marginBottom: 8 }}>{dateStr}</div>
                    <button onClick={() => router.visit('/patient/sos')} style={{
                        background: 'linear-gradient(135deg,#F87171,#DC2626)', color: C.white,
                        border: 'none', borderRadius: 8,
                        padding: '9px 18px', fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                        transition: 'background .15s',
                    }}>
                        🆘 {t.sos}
                    </button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        ...glass({ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }),
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: s.bg, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 20, flexShrink: 0,
                        }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.n}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: C.textHint }}>{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18 }}>
                <div style={{ ...glass({ padding: 22 }) }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        📋 {t.programme_jour}
                    </h2>

                    {prisesState.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMuted }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                            <p style={{ fontSize: 13 }}>{t.aucune_prise}</p>
                        </div>
                    )}

                    {prisesState.map((p, i) => (
                        <div key={p.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '13px 0',
                            borderBottom: i < prisesState.length - 1 ? `0.5px solid ${C.borderLight}` : 'none',
                        }}>
                            <div style={{ minWidth: 48, fontSize: 12, fontWeight: 700, color: C.blue }}>{p.heure_prevue}</div>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                background: p.statut === 'pris' ? C.green : p.statut === 'en_attente' ? C.yellow : C.textHint,
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{ fontSize: 13, fontWeight: 600, color: C.blue, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    onClick={() => setSelectedMed(p)}
                                >{p.medicament}</div>
                                <div style={{ fontSize: 11, color: C.textHint }}>{p.quantite} · {p.temps}</div>
                            </div>
                            <StatutBadge statut={p.statut} t={t} />
                            {p.statut === 'en_attente' && (
                                <button onClick={() => confirmerPrise(p.id)} style={{
                                    background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white,
                                    border: 'none', borderRadius: 8,
                                    padding: '6px 14px', fontWeight: 600, fontSize: 12,
                                    cursor: 'pointer', flexShrink: 0,
                                    transition: 'background .15s',
                                }}>
                                    {t.confirmer}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ ...glass({ padding: 20 }) }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            📊 {t.adherence}
                        </h3>
                        <div style={{
                            fontSize: 34, fontWeight: 800, lineHeight: 1,
                            color: adherence >= 80 ? C.green : adherence >= 60 ? C.yellow : C.red,
                            marginBottom: 10,
                        }}>{adherence}%</div>
                        <ProgressBar value={adherence} />
                        <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>
                            {adherence >= 80 ? `✨ ${t.excellent}` : adherence >= 60 ? `⚠️ ${t.efforts}` : `❌ ${t.pensez}`}
                        </p>
                    </div>
                    {medecin ? (
                        <div style={{ ...glass({ padding: 20 }) }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🩺 {t.mon_medecin}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: C.blueSoft, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                }}>👨‍⚕️</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Dr. {medecin.nom} {medecin.prenom}</div>
                                    <div style={{ fontSize: 11, color: C.textMuted }}>{medecin.specialite}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                                    borderRadius: 8, padding: '8px 12px',
                                    fontSize: 12, color: C.textMuted,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    📞 {medecin.telephone}
                                </div>
                                <a href={`tel:${medecin.telephone}`} style={{
                                    background: C.redSoft, border: `1px solid ${C.border}`,
                                    borderRadius: 8, padding: '9px 12px',
                                    fontSize: 12, fontWeight: 700, color: C.red,
                                    textDecoration: 'none', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}>
                                    🚨 {t.appel_urgence}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            ...glass({ padding: 20, textAlign: 'center' }),
                        }}>
                            <div style={{ fontSize: 30, marginBottom: 8 }}>🩺</div>
                            <p style={{ fontSize: 12, color: C.textMuted }}>{t.aucun_medecin}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal med={selectedMed} onClose={() => setSelectedMed(null)} onConfirm={confirmerPrise} t={t} />
        </AppLayout>
    );
}