import { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const inputStyle = (hasError = false) => ({
    width: '100%', padding: '10px 14px',
    border: hasError ? '1.5px solid var(--red)' : '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
    background: 'var(--panel-soft)', color: 'var(--text)', outline: 'none',
    colorScheme: 'dark',
});

const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

function ErrorText({ message }) {
    if (!message) return null;
    return <p style={{ color: 'var(--red)', fontSize: 12, margin: '4px 0 0' }}>{message}</p>;
}

const copy = {
    fr: {
        title: '📋 Ordonnances', count: 'ordonnance(s)', add: '+ Nouvelle ordonnance',
        patient: 'Patient', doctor: 'Médecin', date: 'Date prescription',
        dosages: 'Dosages', dosage: 'Dosage', medicine: 'Médicament',
        medicinePlaceholder: 'Tapez ou choisissez un médicament',
        quantity: 'Quantité', unit: 'Unité', duration: 'Durée', moments: 'Moments de prise',
        create: 'Créer ordonnance', cancel: 'Annuler', edit: 'Modifier ordonnance', save: 'Enregistrer',
        status: 'Statut', active: 'Active', inactive: 'Inactive',
        activate: 'Activer', deactivate: 'Désactiver', remove: 'Supprimer',
        confirmDelete: 'Supprimer cette ordonnance ?', selectPatient: 'Sélectionner un patient',
        addDosage: '+ Ajouter dosage', empty: 'Aucune ordonnance trouvée.',
    },
    en: {
        title: '📋 Prescriptions', count: 'prescription(s)', add: '+ New prescription',
        patient: 'Patient', doctor: 'Doctor', date: 'Prescription date',
        dosages: 'Dosages', dosage: 'Dosage', medicine: 'Medicine',
        medicinePlaceholder: 'Type or choose a medicine',
        quantity: 'Quantity', unit: 'Unit', duration: 'Duration', moments: 'Dose moments',
        create: 'Create prescription', cancel: 'Cancel', edit: 'Edit prescription', save: 'Save',
        status: 'Status', active: 'Active', inactive: 'Inactive',
        activate: 'Activate', deactivate: 'Deactivate', remove: 'Remove',
        confirmDelete: 'Delete this prescription?', selectPatient: 'Select a patient',
        addDosage: '+ Add dosage', empty: 'No prescription found.',
    },
    ar: {
        title: '📋 الوصفات الطبية', count: 'وصفة', add: '+ وصفة جديدة',
        patient: 'المريض', doctor: 'الطبيب', date: 'تاريخ الوصفة',
        dosages: 'الجرعات', dosage: 'جرعة', medicine: 'الدواء',
        medicinePlaceholder: 'اكتب او اختر الدواء',
        quantity: 'الكمية', unit: 'الوحدة', duration: 'المدة', moments: 'أوقات أخذ الدواء',
        create: 'إنشاء الوصفة', cancel: 'إلغاء', edit: 'تعديل الوصفة', save: 'حفظ',
        status: 'الحالة', active: 'نشطة', inactive: 'غير نشطة',
        activate: 'تفعيل', deactivate: 'إيقاف', remove: 'حذف',
        confirmDelete: 'هل تريد حذف هذه الوصفة؟', selectPatient: 'اختر المريض',
        addDosage: '+ إضافة جرعة', empty: 'لا توجد وصفات.',
    },
};

const emptyDosage = { medicament_id: '', medicament_nom: '', duree: 7, duree_unite: 'jours', quantite: '', quantite_unite: 'mg', temps_ids: [] };
const emptyForm = { patient_id: '', nom_medecin: '', date_prescription: '' };

function DosageForm({ dosages, setDosages, medicaments, temps, errors, t }) {
    const add    = () => setDosages([...dosages, { ...emptyDosage }]);
    const remove = (i) => setDosages(dosages.filter((_, idx) => idx !== i));

    const update = (i, key, value) => {
        const next = [...dosages];
        next[i] = { ...next[i], [key]: value };
        setDosages(next);
    };

    const updateMedicament = (i, value) => {
        const matched = medicaments.find(m => m.nom_commercial?.toLowerCase() === value.trim().toLowerCase());
        const next = [...dosages];
        next[i] = { ...next[i], medicament_nom: value, medicament_id: matched?.id || '' };
        setDosages(next);
    };

    const toggleTemps = (i, id) => {
        const next = [...dosages];
        const ids = next[i].temps_ids;
        next[i] = { ...next[i], temps_ids: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] };
        setDosages(next);
    };

    return (
        <section style={{ borderTop: '1px solid var(--line)', paddingTop: 18, marginTop: 4 }}>
            <datalist id="medicament-options">
                {medicaments.map(m => <option key={m.id} value={m.nom_commercial} />)}
            </datalist>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>{t.dosages}</h4>
                <button type="button" onClick={add} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 800, cursor: 'pointer' }}>
                    {t.addDosage}
                </button>
            </div>
            {dosages.map((dosage, i) => (
                <div key={i} style={{ background: 'var(--panel-soft)', border: '1px solid var(--line)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <strong style={{ color: 'var(--text)', fontSize: 13 }}>{t.dosage} {i + 1}</strong>
                        {dosages.length > 1 && (
                            <button type="button" onClick={() => remove(i)} style={{ background: 'rgba(239,68,68,.1)', color: 'var(--red)', border: 'none', borderRadius: 7, padding: '5px 10px', fontWeight: 800, cursor: 'pointer' }}>
                                {t.remove}
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>{t.medicine}</label>
                            <input list="medicament-options" value={dosage.medicament_nom} onChange={e => updateMedicament(i, e.target.value)} placeholder={t.medicinePlaceholder} style={inputStyle(errors[`dosages.${i}.medicament_nom`])} />
                            <ErrorText message={errors[`dosages.${i}.medicament_nom`] || errors[`dosages.${i}.medicament_id`]} />
                        </div>
                        <div>
                            <label style={labelStyle}>{t.quantity}</label>
                            <input value={dosage.quantite} onChange={e => update(i, 'quantite', e.target.value)} style={inputStyle(errors[`dosages.${i}.quantite`])} />
                            <ErrorText message={errors[`dosages.${i}.quantite`]} />
                        </div>
                        <div>
                            <label style={labelStyle}>{t.unit}</label>
                            <input value={dosage.quantite_unite} onChange={e => update(i, 'quantite_unite', e.target.value)} style={inputStyle()} />
                        </div>
                        <div>
                            <label style={labelStyle}>{t.duration}</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="number" min="1" max="365" value={dosage.duree} onChange={e => update(i, 'duree', e.target.value)} style={{ ...inputStyle(), width: 84 }} />
                                <select value={dosage.duree_unite} onChange={e => update(i, 'duree_unite', e.target.value)} style={inputStyle()}>
                                    <option value="jours">Jours</option>
                                    <option value="semaines">Semaines</option>
                                    <option value="mois">Mois</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <label style={labelStyle}>{t.moments}</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {temps.map(item => {
                                const selected = dosage.temps_ids.includes(item.id);
                                return (
                                    <button key={item.id} type="button" onClick={() => toggleTemps(i, item.id)} style={{
                                        padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                                        border: selected ? '1px solid var(--blue)' : '1px solid var(--line)',
                                        background: selected ? 'rgba(99,102,241,0.1)' : 'var(--panel-soft)',
                                        color: selected ? 'var(--blue)' : 'var(--muted)',
                                    }}>
                                        {item.nom}
                                    </button>
                                );
                            })}
                        </div>
                        <ErrorText message={errors[`dosages.${i}.temps_ids`]} />
                    </div>
                </div>
            ))}
        </section>
    );
}

export default function Ordonnances({ ordonnances = [], patients = [], medicaments = [], temps = [] }) {
    const lang = useLang();
    const t = copy[lang] || copy.fr;
    const { errors = {} } = usePage().props;
    const isRtl = lang === 'ar';

    const [showAdd, setShowAdd]     = useState(false);
    const [showEdit, setShowEdit]   = useState(null);
    const [form, setForm]           = useState(emptyForm);
    const [formDosages, setFormDosages] = useState([{ ...emptyDosage }]);

    const patientOptions = useMemo(() => patients.map(p => ({ id: p.id, label: `${p.prenom} ${p.nom}` })), [patients]);

    const resetAdd = () => { setShowAdd(false); setForm(emptyForm); setFormDosages([{ ...emptyDosage }]); };

    const submit = () => router.post('/responsable/ordonnances', { ...form, dosages: formDosages }, { preserveScroll: true, onSuccess: resetAdd });

    const openEdit = (o) => setShowEdit({ id: o.id, nom_medecin: o.nom_medecin || '', date_prescription: o.date_prescription_raw || '', active: o.active });

    const update = () => router.patch(`/responsable/ordonnances/${showEdit.id}`, showEdit, { preserveScroll: true, onSuccess: () => setShowEdit(null) });

    const destroy = (id) => { if (confirm(t.confirmDelete)) router.delete(`/responsable/ordonnances/${id}`); };

    const toggleActive = (o) => router.patch(`/responsable/ordonnances/${o.id}`, { nom_medecin: o.nom_medecin, date_prescription: o.date_prescription_raw, active: !o.active }, { preserveScroll: true });

    const modalOuter = {
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto', padding: 20,
    };
    const modalInner = {
        ...cardStyle, padding: 28,
        maxWidth: 720, width: '94%', maxHeight: '92vh', overflowY: 'auto',
        direction: isRtl ? 'rtl' : 'ltr',
    };

    return (
        <AppLayout>
            <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.title}</h1>
                        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '6px 0 0' }}>{ordonnances.length} {t.count}</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>
                        {t.add}
                    </button>
                </header>

                <div style={{ display: 'grid', gap: 12 }}>
                    {ordonnances.map(o => (
                        <article key={o.id} style={{ ...cardStyle, padding: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--text)' }}>{o.patient}</span>
                                        <span style={{
                                            background: o.active ? 'rgba(20,184,166,0.1)' : 'var(--panel-soft)',
                                            color: o.active ? 'var(--teal)' : 'var(--muted)',
                                            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                        }}>
                                            {o.active ? t.active : t.inactive}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>Dr. {o.nom_medecin || '-'} — {o.date_prescription}</div>
                                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {o.medicaments?.map((m, i) => (
                                            <span key={i} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', padding: '4px 10px', borderRadius: 18, fontSize: 12, fontWeight: 700 }}>
                                                {m.nom} — {m.quantite} {m.unite} ({m.duree})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                                    <button onClick={() => openEdit(o)} style={{ background: 'rgba(245,158,11,.1)', color: 'var(--amber)', border: 'none', borderRadius: 8, padding: '7px 11px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.edit}</button>
                                    <button onClick={() => toggleActive(o)} style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: 'none', borderRadius: 8, padding: '7px 11px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{o.active ? t.deactivate : t.activate}</button>
                                    <button onClick={() => destroy(o.id)} style={{ background: 'rgba(239,68,68,.08)', color: 'var(--red)', border: 'none', borderRadius: 8, padding: '7px 11px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t.remove}</button>
                                </div>
                            </div>
                        </article>
                    ))}
                    {ordonnances.length === 0 && (
                        <div style={{ ...cardStyle, padding: 32, textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                            <p style={{ color: 'var(--muted)' }}>{t.empty}</p>
                        </div>
                    )}
                </div>
            </div>

            {showAdd && (
                <div onClick={resetAdd} style={modalOuter}>
                    <div onClick={e => e.stopPropagation()} style={modalInner}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 18px', color: 'var(--text)' }}>{t.add}</h3>
                        <div style={{ marginBottom: 14 }}>
                            <label style={labelStyle}>{t.patient}</label>
                            <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} style={inputStyle(errors.patient_id)}>
                                <option value="">{t.selectPatient}</option>
                                {patientOptions.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                            <ErrorText message={errors.patient_id} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                                <label style={labelStyle}>{t.doctor}</label>
                                <input value={form.nom_medecin} onChange={e => setForm({ ...form, nom_medecin: e.target.value })} style={inputStyle(errors.nom_medecin)} />
                                <ErrorText message={errors.nom_medecin} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t.date}</label>
                                <input type="date" value={form.date_prescription} onChange={e => setForm({ ...form, date_prescription: e.target.value })} style={inputStyle(errors.date_prescription)} />
                                <ErrorText message={errors.date_prescription} />
                            </div>
                        </div>
                        <DosageForm dosages={formDosages} setDosages={setFormDosages} medicaments={medicaments} temps={temps} errors={errors} t={t} />
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <button onClick={resetAdd} style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.cancel}</button>
                            <button onClick={submit} style={{ flex: 1, padding: 12, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>{t.create}</button>
                        </div>
                    </div>
                </div>
            )}

            {showEdit && (
                <div onClick={() => setShowEdit(null)} style={modalOuter}>
                    <div onClick={e => e.stopPropagation()} style={{ ...modalInner, maxWidth: 560 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 18px', color: 'var(--text)' }}>{t.edit}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                                <label style={labelStyle}>{t.doctor}</label>
                                <input value={showEdit.nom_medecin} onChange={e => setShowEdit({ ...showEdit, nom_medecin: e.target.value })} style={inputStyle(errors.nom_medecin)} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t.date}</label>
                                <input type="date" value={showEdit.date_prescription} onChange={e => setShowEdit({ ...showEdit, date_prescription: e.target.value })} style={inputStyle(errors.date_prescription)} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>{t.status}</label>
                            <select value={String(showEdit.active)} onChange={e => setShowEdit({ ...showEdit, active: e.target.value === 'true' })} style={inputStyle()}>
                                <option value="true">{t.active}</option>
                                <option value="false">{t.inactive}</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowEdit(null)} style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.cancel}</button>
                            <button onClick={update} style={{ flex: 1, padding: 12, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>{t.save}</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}