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

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: C.textMuted, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const medecinText = {
    fr: {
        titre: '🩺 Médecins', nb: 'médecin(s)', ajouter: '+ Ajouter',
        nom: 'Nom', prenom: 'Prénom', specialite: 'Spécialité', telephone: 'Téléphone', email: 'Email',
        detail: '👁️ Détail', modifier: '✏️ Modifier', supprimer: '🗑️ Suppr.', patients_label: 'patient(s)',
        annuler: 'Annuler', enregistrer: 'Enregistrer', fermer: 'Fermer',
        modal_add: '➕ Nouveau médecin', modal_edit: '✏️ Modifier médecin',
        aucun: 'Aucun médecin enregistré. Cliquez sur + Ajouter.', supprimer_confirm: 'Supprimer ce médecin ?', patients_detail: 'Patients :',
    },
    en: {
        titre: '🩺 Doctors', nb: 'doctor(s)', ajouter: '+ Add',
        nom: 'Last name', prenom: 'First name', specialite: 'Specialty', telephone: 'Phone', email: 'Email',
        detail: '👁️ Detail', modifier: '✏️ Edit', supprimer: '🗑️ Delete', patients_label: 'patient(s)',
        annuler: 'Cancel', enregistrer: 'Save', fermer: 'Close',
        modal_add: '➕ New doctor', modal_edit: '✏️ Edit doctor',
        aucun: 'No doctors registered. Click + Add.', supprimer_confirm: 'Delete this doctor?', patients_detail: 'Patients:',
    },
    ar: {
        titre: '🩺 الأطباء', nb: 'طبيب', ajouter: '+ إضافة',
        nom: 'اللقب', prenom: 'الاسم', specialite: 'التخصص', telephone: 'الهاتف', email: 'البريد الإلكتروني',
        detail: '👁️ التفاصيل', modifier: '✏️ تعديل', supprimer: '🗑️ حذف', patients_label: 'مريض',
        annuler: 'إلغاء', enregistrer: 'حفظ', fermer: 'إغلاق',
        modal_add: '➕ طبيب جديد', modal_edit: '✏️ تعديل الطبيب',
        aucun: 'لا يوجد أطباء مسجلون.', supprimer_confirm: 'حذف هذا الطبيب؟', patients_detail: 'المرضى:',
    },
};

const medecinInp = { 
    width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, 
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 16, 
    backgroundColor: 'rgba(255,255,255,0.06)', color: C.text, outline: 'none' 
};

const MField = ({ label, fkey, type = 'text', state, setState }) => (
    <div>
        <label style={lbl}>{label}</label>
        <input type={type} value={state[fkey]} onChange={e => setState(prev => ({ ...prev, [fkey]: e.target.value }))} style={medecinInp} />
    </div>
);

const MModal = ({ title, state, setState, onSave, onClose, t }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={e => e.stopPropagation()} style={{ ...glass({ padding: 32, maxWidth: 440, width: '90%' }) }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: C.text }}>{title}</h3>
            <MField label={t.nom}       fkey="nom"       state={state} setState={setState} />
            <MField label={t.prenom}    fkey="prenom"    state={state} setState={setState} />
            <MField label={t.specialite} fkey="specialite" state={state} setState={setState} />
            <MField label={t.telephone} fkey="telephone" type="tel"   state={state} setState={setState} />
            <MField label={t.email}     fkey="email"     type="email" state={state} setState={setState} />
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{ flex: 1, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.annuler}</button>
                <button onClick={onSave} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{t.enregistrer}</button>
            </div>
        </div>
    </div>
);

export default function Medecins({ medecins = [] }) {
    const lang = useLang();
    const t = medecinText[lang] || medecinText.fr;
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [showDetail, setShowDetail] = useState(null);
    const [form, setForm] = useState({ nom: '', prenom: '', specialite: '', telephone: '', email: '' });

    const submit = () => router.post('/responsable/medecins', form, { 
        onSuccess: () => { 
            setShowAdd(false); 
            setForm({ nom: '', prenom: '', specialite: '', telephone: '', email: '' }); 
        } 
    });
    
    const update = () => router.patch(`/responsable/medecins/${showEdit.id}`, showEdit, { 
        onSuccess: () => setShowEdit(null) 
    });
    
    const destroy = (id) => { 
        if (confirm(t.supprimer_confirm)) router.delete(`/responsable/medecins/${id}`); 
    };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>{t.titre}</h1>
                    <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{medecins.length} {t.nb}</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(129,140,248,0.35)' }}>{t.ajouter}</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {medecins.map(m => (
                    <div key={m.id} style={glass({ padding: 20, transition: 'transform 0.2s, box-shadow 0.2s' })}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)'; }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,rgba(129,140,248,0.2),rgba(167,139,250,0.2))', border: `1px solid ${C.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>👨‍⚕️</div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Dr. {m.nom} {m.prenom}</div>
                                <div style={{ color: C.green, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{m.specialite}</div>
                            </div>
                            <span style={{ backgroundColor: C.blueSoft, color: C.blue, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{m.patients_count} {t.patients_label}</span>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 13, color: C.textMuted, lineHeight: 2.2 }}>
                            <div>📞 <a href={`tel:${m.telephone}`} style={{ color: C.blue, fontWeight: 600 }}>{m.telephone}</a></div>
                            <div>✉️ {m.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button onClick={() => setShowDetail(m)} style={{ flex: 1, padding: '8px', backgroundColor: C.blueSoft, color: C.blue, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t.detail}</button>
                            <button onClick={() => setShowEdit({ ...m })} style={{ flex: 1, padding: '8px', backgroundColor: C.greenSoft, color: C.green, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t.modifier}</button>
                            <button onClick={() => destroy(m.id)} style={{ flex: 1, padding: '8px', backgroundColor: C.redSoft, color: C.red, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t.supprimer}</button>
                        </div>
                    </div>
                ))}
            </div>

            {medecins.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🩺</div>
                    <p>{t.aucun}</p>
                </div>
            )}

            {showAdd && <MModal title={t.modal_add} state={form} setState={setForm} onSave={submit} onClose={() => setShowAdd(false)} t={t} />}
            {showEdit && <MModal title={t.modal_edit} state={showEdit} setState={setShowEdit} onSave={update} onClose={() => setShowEdit(null)} t={t} />}

            {showDetail && (
                <div onClick={() => setShowDetail(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={glass({ padding: 32, maxWidth: 400, width: '90%' })}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>👨‍⚕️</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: C.text }}>Dr. {showDetail.nom} {showDetail.prenom}</h3>
                            <div style={{ color: C.green, fontWeight: 600, marginTop: 4 }}>{showDetail.specialite}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 2.2, color: C.textMuted, border: `1px solid ${C.borderLight}` }}>
                            <div>📞 <strong style={{ color: C.text }}>{t.telephone} :</strong> <a href={`tel:${showDetail.telephone}`} style={{ color: C.blue, fontWeight: 600 }}>{showDetail.telephone}</a></div>
                            <div>✉️ <strong style={{ color: C.text }}>{t.email} :</strong> {showDetail.email}</div>
                            <div>👥 <strong style={{ color: C.text }}>{t.patients_detail}</strong> {showDetail.patients_count}</div>
                        </div>
                        <button onClick={() => setShowDetail(null)} style={{ width: '100%', marginTop: 10, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>
                            {t.fermer}
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}