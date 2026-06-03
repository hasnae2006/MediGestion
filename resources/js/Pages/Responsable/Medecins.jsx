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

const medecinInp = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 16,
    background: 'var(--panel-soft)', color: 'var(--text)', outline: 'none',
    colorScheme: 'dark',
};

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const medecinText = {
    fr: { titre: '🩺 Médecins', nb: 'médecin(s)', ajouter: '+ Ajouter', nom: 'Nom', prenom: 'Prénom', specialite: 'Spécialité', telephone: 'Téléphone', email: 'Email', detail: '👁️ Détail', modifier: '✏️ Modifier', supprimer: '🗑️ Suppr.', patients_label: 'patient(s)', annuler: 'Annuler', enregistrer: 'Enregistrer', fermer: 'Fermer', modal_add: '➕ Nouveau médecin', modal_edit: '✏️ Modifier médecin', aucun: 'Aucun médecin enregistré. Cliquez sur + Ajouter.', supprimer_confirm: 'Supprimer ce médecin ?', patients_detail: 'Patients :' },
    en: { titre: '🩺 Doctors', nb: 'doctor(s)', ajouter: '+ Add', nom: 'Last name', prenom: 'First name', specialite: 'Specialty', telephone: 'Phone', email: 'Email', detail: '👁️ Detail', modifier: '✏️ Edit', supprimer: '🗑️ Delete', patients_label: 'patient(s)', annuler: 'Cancel', enregistrer: 'Save', fermer: 'Close', modal_add: '➕ New doctor', modal_edit: '✏️ Edit doctor', aucun: 'No doctors registered. Click + Add.', supprimer_confirm: 'Delete this doctor?', patients_detail: 'Patients:' },
    ar: { titre: '🩺 الأطباء', nb: 'طبيب', ajouter: '+ إضافة', nom: 'اللقب', prenom: 'الاسم', specialite: 'التخصص', telephone: 'الهاتف', email: 'البريد الإلكتروني', detail: '👁️ التفاصيل', modifier: '✏️ تعديل', supprimer: '🗑️ حذف', patients_label: 'مريض', annuler: 'إلغاء', enregistrer: 'حفظ', fermer: 'إغلاق', modal_add: '➕ طبيب جديد', modal_edit: '✏️ تعديل الطبيب', aucun: 'لا يوجد أطباء مسجلون.', supprimer_confirm: 'حذف هذا الطبيب؟', patients_detail: 'المرضى:' },
};

const MField = ({ label, fkey, type = 'text', state, setState }) => (
    <div>
        <label style={lbl}>{label}</label>
        <input type={type} value={state[fkey]} onChange={e => setState(prev => ({ ...prev, [fkey]: e.target.value }))} style={medecinInp} />
    </div>
);

const modalOuter = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };

const MModal = ({ title, state, setState, onSave, onClose, t }) => (
    <div onClick={onClose} style={modalOuter}>
        <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, padding: 32, maxWidth: 440, width: '90%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>{title}</h3>
            <MField label={t.nom}        fkey="nom"        state={state} setState={setState} />
            <MField label={t.prenom}     fkey="prenom"     state={state} setState={setState} />
            <MField label={t.specialite} fkey="specialite" state={state} setState={setState} />
            <MField label={t.telephone}  fkey="telephone"  type="tel"   state={state} setState={setState} />
            <MField label={t.email}      fkey="email"      type="email" state={state} setState={setState} />
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.annuler}</button>
                <button onClick={onSave}  style={{ flex: 1, padding: 12, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>{t.enregistrer}</button>
            </div>
        </div>
    </div>
);

export default function Medecins({ medecins = [] }) {
    const lang = useLang();
    const t = medecinText[lang] || medecinText.fr;
    const [showAdd, setShowAdd]       = useState(false);
    const [showEdit, setShowEdit]     = useState(null);
    const [showDetail, setShowDetail] = useState(null);
    const [form, setForm] = useState({ nom: '', prenom: '', specialite: '', telephone: '', email: '' });

    const submit  = () => router.post('/responsable/medecins', form, { onSuccess: () => { setShowAdd(false); setForm({ nom: '', prenom: '', specialite: '', telephone: '', email: '' }); } });
    const update  = () => router.patch(`/responsable/medecins/${showEdit.id}`, showEdit, { onSuccess: () => setShowEdit(null) });
    const destroy = (id) => { if (confirm(t.supprimer_confirm)) router.delete(`/responsable/medecins/${id}`); };

    return (
        <AppLayout>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.titre}</h1>
                    <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{medecins.length} {t.nb}</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>{t.ajouter}</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {medecins.map(m => (
                    <div key={m.id} style={{ ...cardStyle, padding: 20, transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.1)', border: '1px solid var(--line)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>👨‍⚕️</div>
                                <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--text)' }}>Dr. {m.nom} {m.prenom}</div>
                                <div style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 700, marginTop: 2 }}>{m.specialite}</div>
                            </div>
                            <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{m.patients_count} {t.patients_label}</span>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 2.2 }}>
                            <div>📞 <a href={`tel:${m.telephone}`} style={{ color: 'var(--blue)', fontWeight: 700 }}>{m.telephone}</a></div>
                            <div>✉️ {m.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button onClick={() => setShowDetail(m)} style={{ flex: 1, padding: '8px', background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.detail}</button>
                            <button onClick={() => setShowEdit({ ...m })} style={{ flex: 1, padding: '8px', background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.modifier}</button>
                            <button onClick={() => destroy(m.id)} style={{ flex: 1, padding: '8px', background: 'rgba(239,68,68,.08)', color: 'var(--red)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.supprimer}</button>
                        </div>
                    </div>
                ))}
            </div>

            {medecins.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🩺</div>
                    <p>{t.aucun}</p>
                </div>
            )}

            {showAdd  && <MModal title={t.modal_add}  state={form}     setState={setForm}     onSave={submit} onClose={() => setShowAdd(false)}  t={t} />}
            {showEdit && <MModal title={t.modal_edit} state={showEdit} setState={setShowEdit} onSave={update} onClose={() => setShowEdit(null)} t={t} />}

            {showDetail && (
                <div onClick={() => setShowDetail(null)} style={modalOuter}>
                    <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, padding: 32, maxWidth: 400, width: '90%' }}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>👨‍⚕️</div>
                            <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--text)' }}>Dr. {showDetail.nom} {showDetail.prenom}</h3>
                            <div style={{ color: 'var(--teal)', fontWeight: 700, marginTop: 4 }}>{showDetail.specialite}</div>
                        </div>
                        <div style={{ background: 'var(--panel-soft)', borderRadius: 8, padding: 16, fontSize: 14, lineHeight: 2.2, color: 'var(--muted)', border: '1px solid var(--line)' }}>
                            <div>📞 <strong style={{ color: 'var(--text)' }}>{t.telephone} :</strong> <a href={`tel:${showDetail.telephone}`} style={{ color: 'var(--blue)', fontWeight: 700 }}>{showDetail.telephone}</a></div>
                            <div>✉️ <strong style={{ color: 'var(--text)' }}>{t.email} :</strong> {showDetail.email}</div>
                            <div>👥 <strong style={{ color: 'var(--text)' }}>{t.patients_detail}</strong> {showDetail.patients_count}</div>
                        </div>
                        <button onClick={() => setShowDetail(null)} style={{ width: '100%', marginTop: 10, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.fermer}</button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}