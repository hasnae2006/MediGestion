import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const inp = () => ({
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
    background: 'var(--panel-soft)', color: 'var(--text)', outline: 'none',
    colorScheme: 'dark',
});

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const alertText = {
    fr: { titre: '🚨 Alertes SOS', nb: 'alerte(s)', envoyer: '📤 Envoyer notification', fermer: '✕ Fermer', form_titre: '📤 Envoyer une notification au patient', patient: 'Patient', choisir: '-- Choisir un patient --', type: 'Type', titre_champ: 'Titre', message: 'Message', placeholder_titre: 'Ex: Rappel prise du soir', placeholder_msg: 'Écrivez votre message ici...', annuler: 'Annuler', envoyer_btn: '📤 Envoyer', aucune: 'Aucune alerte pour le moment', marquer_lu: '👁️ Marquer lu', traite: '✅ Traité', statuts: { envoye: '🆘 Envoyé', lu: '👁️ Lu', traite: '✅ Traité' }, types: { rappel: '⏰ Rappel médicament', info: 'ℹ️ Information', alerte: '🚨 Alerte urgente', message: '💬 Message' } },
    en: { titre: '🚨 SOS Alerts', nb: 'alert(s)', envoyer: '📤 Send notification', fermer: '✕ Close', form_titre: '📤 Send a notification to patient', patient: 'Patient', choisir: '-- Choose a patient --', type: 'Type', titre_champ: 'Title', message: 'Message', placeholder_titre: 'Ex: Evening dose reminder', placeholder_msg: 'Write your message here...', annuler: 'Cancel', envoyer_btn: '📤 Send', aucune: 'No alerts for now', marquer_lu: '👁️ Mark as read', traite: '✅ Treated', statuts: { envoye: '🆘 Sent', lu: '👁️ Read', traite: '✅ Treated' }, types: { rappel: '⏰ Medication reminder', info: 'ℹ️ Information', alerte: '🚨 Urgent alert', message: '💬 Message' } },
    ar: { titre: '🚨 تنبيهات SOS', nb: 'تنبيه', envoyer: '📤 إرسال إشعار', fermer: '✕ إغلاق', form_titre: '📤 إرسال إشعار للمريض', patient: 'المريض', choisir: '-- اختر مريضاً --', type: 'النوع', titre_champ: 'العنوان', message: 'الرسالة', placeholder_titre: 'مثال: تذكير بالجرعة المسائية', placeholder_msg: 'اكتب رسالتك هنا...', annuler: 'إلغاء', envoyer_btn: '📤 إرسال', aucune: 'لا توجد تنبيهات حالياً', marquer_lu: '👁️ تعيين كمقروء', traite: '✅ تمت المعالجة', statuts: { envoye: '🆘 مُرسل', lu: '👁️ مقروء', traite: '✅ تمت المعالجة' }, types: { rappel: '⏰ تذكير بالدواء', info: 'ℹ️ معلومات', alerte: '🚨 تنبيه عاجل', message: '💬 رسالة' } },
};

const emptyAlertForm = { patient_id: '', type: 'rappel', titre: '', message: '' };

const statutStyles = {
    envoye: { bg: 'rgba(239,68,68,.08)', color: 'var(--red)' },
    lu:     { bg: 'rgba(245,158,11,.1)', color: 'var(--amber)' },
    traite: { bg: 'rgba(20,184,166,0.1)', color: 'var(--teal)' },
};

export default function Alertes({ alertes = [], patients = [] }) {
    const lang = useLang();
    const t = alertText[lang] || alertText.fr;
    const [showSend, setShowSend] = useState(false);
    const [form, setForm] = useState(emptyAlertForm);

    const marquer = (id, statut) => router.patch(`/responsable/alertes/${id}`, { statut }, { preserveScroll: true });
    const envoyer = () => router.post('/responsable/notifications/send', form, { preserveScroll: true, onSuccess: () => { setShowSend(false); setForm(emptyAlertForm); } });

    return (
        <AppLayout>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.titre}</h1>
                    <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{alertes.length} {t.nb}</p>
                </div>
                <button onClick={() => setShowSend(!showSend)} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>
                    {showSend ? t.fermer : t.envoyer}
                </button>
            </header>

            {showSend && (
                <div style={{ ...cardStyle, padding: 24, marginBottom: 24, borderLeft: '3px solid var(--teal)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>{t.form_titre}</h3>
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
                        <button onClick={() => { setShowSend(false); setForm(emptyAlertForm); }} style={{ padding: '10px 20px', border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.annuler}</button>
                        <button onClick={envoyer} disabled={!form.patient_id || !form.titre || !form.message} style={{ padding: '10px 24px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', opacity: (!form.patient_id || !form.titre || !form.message) ? 0.4 : 1 }}>
                            {t.envoyer_btn}
                        </button>
                    </div>
                </div>
            )}

            {alertes.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: 48 }}>✅</div>
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>{t.aucune}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {alertes.map(a => {
                        const s = statutStyles[a.statut] || {};
                        return (
                            <div key={a.id} style={{ ...cardStyle, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontWeight: 900, fontSize: 15, color: 'var(--text)' }}>{a.patient}</span>
                                        <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{t.statuts[a.statut]}</span>
                                        <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 'auto' }}>{a.date}</span>
                                    </div>
                                    <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>{a.message}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                                    {a.statut === 'envoye' && (
                                        <button onClick={() => marquer(a.id, 'lu')} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.marquer_lu}</button>
                                    )}
                                    {a.statut !== 'traite' && (
                                        <button onClick={() => marquer(a.id, 'traite')} style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.traite}</button>
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