import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

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
        pris:       { bg: 'rgba(20,184,166,0.1)',  color: 'var(--teal)',  icon: '✓' , label: t.pris       },
        en_attente: { bg: 'rgba(245,158,11,.1)',   color: 'var(--amber)', icon: '⏱', label: t.a_prendre  },
        manque:     { bg: 'rgba(239,68,68,.08)',   color: 'var(--red)',   icon: '✕' , label: t.oublies    },
    };
    const s = styles[statut] || { bg: 'rgba(45,108,223,0.1)', color: 'var(--blue)', icon: '⏳', label: '—' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: s.bg, color: s.color,
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
        }}>
            {s.icon} {s.label}
        </span>
    );
}
function ProgressBar({ value }) {
    const color = value >= 80 ? 'var(--teal)' : value >= 60 ? 'var(--amber)' : 'var(--red)';
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <div style={{ background: 'var(--line)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
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
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                ...cardStyle, padding: 28,
                maxWidth: 400, width: '90%',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', margin: 0 }}>{t.details}</h3>
                    <button onClick={onClose} style={{
                        border: '1px solid var(--line)',
                        background: 'var(--panel-soft)',
                        borderRadius: 8,
                        width: 32, height: 32, cursor: 'pointer',
                        color: 'var(--muted)', fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    {med.photo_boite
                        ? <img src={`/storage/${med.photo_boite}`} alt={med.medicament} style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 12, border: '1px solid var(--line)' }} />
                        : <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(45,108,223,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto' }}>
                            {formeIcon[med.forme] || '💊'}
                          </div>
                    }
                </div>

                {rows.map(item => (
                    <div key={item.label} style={{
                        display: 'flex', gap: 12, padding: '10px 0',
                        borderBottom: '1px solid var(--line)',
                    }}>
                        <span style={{ fontSize: 18, width: 28, flexShrink: 0 }}>{item.icon}</span>
                        <div>
                            <div style={{ ...lbl, marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>{item.value}</div>
                        </div>
                    </div>
                ))}

                {med.statut === 'en_attente' && (
                    <button onClick={() => { onConfirm(med.id); onClose(); }} style={{
                        width: '100%', marginTop: 20, padding: 13,
                        background: 'var(--teal)', color: '#fff',
                        border: 'none', borderRadius: 10,
                        fontWeight: 900, fontSize: 14, cursor: 'pointer',
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
    const t    = text[lang] || text.fr;
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
        { n: total,   label: t.total,     sub: t.aujourdhui, icon: '💊', color: 'var(--blue)',  bg: 'rgba(45,108,223,0.1)'  },
        { n: prises,  label: t.pris,      sub: t.bravo,      icon: '✓',  color: 'var(--teal)',  bg: 'rgba(20,184,166,0.1)'  },
        { n: attente, label: t.a_prendre, sub: t.noubliez,   icon: '⏱', color: 'var(--amber)', bg: 'rgba(245,158,11,.1)'   },
        { n: oublies, label: t.oublies,   sub: t.ce_mois,    icon: '✕',  color: 'var(--red)',   bg: 'rgba(239,68,68,.08)'   },
    ];

    return (
        <AppLayout>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', margin: 0 }}>
                        {t.bonjour} {user?.prenom}
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{t.programme}</p>
                    {prochainePrise && (
                        <div style={{
                            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(45,108,223,0.1)', border: '1px solid var(--line)',
                            borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--blue)',
                            fontWeight: 800,
                        }}>
                            ⏰ {t.prochaine} <strong>{prochainePrise.heure_prevue}</strong> — {prochainePrise.medicament}
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize', marginBottom: 8 }}>{dateStr}</div>
                    <button onClick={() => router.visit('/patient/sos')} style={{
                        background: 'var(--red)', color: '#fff',
                        border: 'none', borderRadius: 8,
                        padding: '10px 20px', fontWeight: 900, fontSize: 13,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}>
                        🆘 {t.sos}
                    </button>
                </div>
            </header>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ ...cardStyle, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: s.bg, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 20, flexShrink: 0,
                        }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.n}</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', marginTop: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18 }}>
                <div style={{ ...cardStyle, padding: 22 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        📋 {t.programme_jour}
                    </h2>

                    {prisesState.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                            <p style={{ fontSize: 13 }}>{t.aucune_prise}</p>
                        </div>
                    )}

                    {prisesState.map((p, i) => (
                        <div key={p.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '13px 0',
                            borderBottom: i < prisesState.length - 1 ? '1px solid var(--line)' : 'none',
                        }}>
                            <div style={{ minWidth: 48, fontSize: 12, fontWeight: 800, color: 'var(--blue)' }}>{p.heure_prevue}</div>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                background: p.statut === 'pris' ? 'var(--teal)' : p.statut === 'en_attente' ? 'var(--amber)' : 'var(--muted)',
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue)', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    onClick={() => setSelectedMed(p)}
                                >{p.medicament}</div>
                                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.quantite} · {p.temps}</div>
                            </div>
                            <StatutBadge statut={p.statut} t={t} />
                            {p.statut === 'en_attente' && (
                                <button onClick={() => confirmerPrise(p.id)} style={{
                                    background: 'var(--teal)', color: '#fff',
                                    border: 'none', borderRadius: 8,
                                    padding: '6px 14px', fontWeight: 800, fontSize: 12,
                                    cursor: 'pointer', flexShrink: 0,
                                }}>
                                    {t.confirmer}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ ...cardStyle, padding: 20 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            📊 {t.adherence}
                        </h3>
                        <div style={{
                            fontSize: 34, fontWeight: 900, lineHeight: 1, marginBottom: 10,
                            color: adherence >= 80 ? 'var(--teal)' : adherence >= 60 ? 'var(--amber)' : 'var(--red)',
                        }}>{adherence}%</div>
                        <ProgressBar value={adherence} />
                        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                            {adherence >= 80 ? `✨ ${t.excellent}` : adherence >= 60 ? `⚠️ ${t.efforts}` : `❌ ${t.pensez}`}
                        </p>
                    </div>
                    {medecin ? (
                        <div style={{ ...cardStyle, padding: 20 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                🩺 {t.mon_medecin}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: 'rgba(45,108,223,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                }}>👨‍⚕️</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>Dr. {medecin.nom} {medecin.prenom}</div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{medecin.specialite}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{
                                    background: 'var(--panel-soft)', border: '1px solid var(--line)',
                                    borderRadius: 8, padding: '8px 12px',
                                    fontSize: 12, color: 'var(--muted)',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    📞 {medecin.telephone}
                                </div>
                                <a href={`tel:${medecin.telephone}`} style={{
                                    background: 'rgba(239,68,68,.08)', border: '1px solid var(--line)',
                                    borderRadius: 8, padding: '9px 12px',
                                    fontSize: 12, fontWeight: 800, color: 'var(--red)',
                                    textDecoration: 'none', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}>
                                    🚨 {t.appel_urgence}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div style={{ ...cardStyle, padding: 20, textAlign: 'center' }}>
                            <div style={{ fontSize: 30, marginBottom: 8 }}>🩺</div>
                            <p style={{ fontSize: 12, color: 'var(--muted)' }}>{t.aucun_medecin}</p>
                        </div>
                    )}
                </div>
            </div>
            <Modal med={selectedMed} onClose={() => setSelectedMed(null)} onConfirm={confirmerPrise} t={t} />
        </AppLayout>
    );
}
