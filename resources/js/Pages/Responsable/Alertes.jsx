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
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    ...extra,
});

const inp = (err = false) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${err ? C.red : C.border}`,
    borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: C.text, outline: 'none',
});

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: C.textMuted, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

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
const alertText = {
    fr: {
        titre: '🚨 Alertes SOS', nb: 'alerte(s)',
        envoyer: '📤 Envoyer notification', fermer: '✕ Fermer',
        form_titre: '📤 Envoyer une notification au patient',
        patient: 'Patient', choisir: '-- Choisir un patient --',
        type: 'Type', titre_champ: 'Titre', message: 'Message',
        placeholder_titre: 'Ex: Rappel prise du soir',
        placeholder_msg: 'Écrivez votre message ici...',
        annuler: 'Annuler', envoyer_btn: '📤 Envoyer',
        aucune: 'Aucune alerte pour le moment',
        marquer_lu: '👁️ Marquer lu', traite: '✅ Traité',
        statuts: { envoye: '🆘 Envoyé', lu: '👁️ Lu', traite: '✅ Traité' },
        types: { rappel: '⏰ Rappel médicament', info: 'ℹ️ Information', alerte: '🚨 Alerte urgente', message: '💬 Message' },
    },
    en: {
        titre: '🚨 SOS Alerts', nb: 'alert(s)',
        envoyer: '📤 Send notification', fermer: '✕ Close',
        form_titre: '📤 Send a notification to patient',
        patient: 'Patient', choisir: '-- Choose a patient --',
        type: 'Type', titre_champ: 'Title', message: 'Message',
        placeholder_titre: 'Ex: Evening dose reminder',
        placeholder_msg: 'Write your message here...',
        annuler: 'Cancel', envoyer_btn: '📤 Send',
        aucune: 'No alerts for now',
        marquer_lu: '👁️ Mark as read', traite: '✅ Treated',
        statuts: { envoye: '🆘 Sent', lu: '👁️ Read', traite: '✅ Treated' },
        types: { rappel: '⏰ Medication reminder', info: 'ℹ️ Information', alerte: '🚨 Urgent alert', message: '💬 Message' },
    },
    ar: {
        titre: '🚨 تنبيهات SOS', nb: 'تنبيه',
        envoyer: '📤 إرسال إشعار', fermer: '✕ إغلاق',
        form_titre: '📤 إرسال إشعار للمريض',
        patient: 'المريض', choisir: '-- اختر مريضاً --',
        type: 'النوع', titre_champ: 'العنوان', message: 'الرسالة',
        placeholder_titre: 'مثال: تذكير بالجرعة المسائية',
        placeholder_msg: 'اكتب رسالتك هنا...',
        annuler: 'إلغاء', envoyer_btn: '📤 إرسال',
        aucune: 'لا توجد تنبيهات حالياً',
        marquer_lu: '👁️ تعيين كمقروء', traite: '✅ تمت المعالجة',
        statuts: { envoye: '🆘 مُرسل', lu: '👁️ مقروء', traite: '✅ تمت المعالجة' },
        types: { rappel: '⏰ تذكير بالدواء', info: 'ℹ️ معلومات', alerte: '🚨 تنبيه عاجل', message: '💬 رسالة' },
    },
};

const emptyAlertForm = { patient_id: '', type: 'rappel', titre: '', message: '' };

export default function Alertes({ alertes = [], patients = [] }) {
    const lang = useLang();
    const t = alertText[lang] || alertText.fr;
    const [showSend, setShowSend] = useState(false);
    const [form, setForm] = useState(emptyAlertForm);

    const marquer = (id, statut) => router.patch(`/responsable/alertes/${id}`, { statut }, { preserveScroll: true });
    const envoyer = () => router.post('/responsable/notifications/send', form, {
        preserveScroll: true,
        onSuccess: () => { setShowSend(false); setForm(emptyAlertForm); }
    });

    const statutStyles = {
        envoye: { bg: C.redSoft, color: C.red },
        lu:     { bg: C.yellowSoft, color: C.yellow },
        traite: { bg: C.greenSoft, color: C.green },
    };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>{t.titre}</h1>
                    <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{alertes.length} {t.nb}</p>
                </div>
                <button onClick={() => setShowSend(!showSend)} style={{
                    background: 'linear-gradient(135deg,#34D399,#059669)',
                    color: '#0F1535', border: 'none', borderRadius: 10,
                    padding: '10px 20px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(52,211,153,0.3)',
                }}>
                    {showSend ? t.fermer : t.envoyer}
                </button>
            </div>

            {showSend && (
                <div style={{ ...glass({ padding: 24, marginBottom: 24, border: `1px solid rgba(52,211,153,0.3)` }) }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: C.text }}>{t.form_titre}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={lbl}>{t.patient}</label>
                            <select style={inp()} value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })}>
                                <option value="">{t.choisir}</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>{t.type}</label>
                            <select style={inp()} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                {Object.entries(t.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={lbl}>{t.titre_champ}</label>
                        <input style={inp()} value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder={t.placeholder_titre} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={lbl}>{t.message}</label>
                        <textarea style={{ ...inp(), height: 80, resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t.placeholder_msg} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => { setShowSend(false); setForm(emptyAlertForm); }} style={{ padding: '10px 20px', border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.annuler}</button>
                        <button onClick={envoyer} disabled={!form.patient_id || !form.titre || !form.message} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#34D399,#059669)', color: '#0F1535', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', opacity: (!form.patient_id || !form.titre || !form.message) ? 0.4 : 1 }}>
                            {t.envoyer_btn}
                        </button>
                    </div>
                </div>
            )}

            {alertes.length === 0 ? (
                <div style={{ ...glass({ textAlign: 'center', padding: 60 }) }}>
                    <div style={{ fontSize: 48 }}>✅</div>
                    <p style={{ color: C.textMuted, marginTop: 12 }}>{t.aucune}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {alertes.map(a => {
                        const s = statutStyles[a.statut] || {};
                        return (
                            <div key={a.id} style={{ ...glass({ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }) }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{a.patient}</span>
                                        <span style={{ backgroundColor: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.statuts[a.statut]}</span>
                                        <span style={{ color: C.textHint, fontSize: 12, marginLeft: 'auto' }}>{a.date}</span>
                                    </div>
                                    <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>{a.message}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                                    {a.statut === 'envoye' && (
                                        <button onClick={() => marquer(a.id, 'lu')} style={{ backgroundColor: C.blueSoft, color: C.blue, border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t.marquer_lu}</button>
                                    )}
                                    {a.statut !== 'traite' && (
                                        <button onClick={() => marquer(a.id, 'traite')} style={{ backgroundColor: C.greenSoft, color: C.green, border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t.traite}</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}