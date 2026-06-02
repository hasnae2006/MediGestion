import { useMemo, useState } from 'react';
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

const inputStyle = (hasError = false) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${hasError ? C.red : C.border}`,
    borderRadius: 10,
    fontSize: 14,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: C.text,
    outline: 'none',
});

const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: C.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

function ErrorText({ message }) {
    if (!message) return null;
    return <p style={{ color: C.red, fontSize: 12, margin: '4px 0 0' }}>{message}</p>;
}

const copy = {
    fr: {
        title: '📋 Ordonnances',
        count: 'ordonnance(s)',
        add: '+ Nouvelle ordonnance',
        patient: 'Patient',
        doctor: 'Médecin',
        date: 'Date prescription',
        dosages: 'Dosages',
        dosage: 'Dosage',
        medicine: 'Médicament',
        medicinePlaceholder: 'Tapez ou choisissez un médicament',
        quantity: 'Quantité',
        unit: 'Unité',
        duration: 'Durée',
        moments: 'Moments de prise',
        create: 'Créer ordonnance',
        cancel: 'Annuler',
        edit: 'Modifier ordonnance',
        save: 'Enregistrer',
        status: 'Statut',
        active: 'Active',
        inactive: 'Inactive',
        activate: 'Activer',
        deactivate: 'Désactiver',
        remove: 'Supprimer',
        confirmDelete: 'Supprimer cette ordonnance ?',
        selectPatient: 'Sélectionner un patient',
        addDosage: '+ Ajouter dosage',
        empty: 'Aucune ordonnance trouvée.',
    },
    en: {
        title: '📋 Prescriptions',
        count: 'prescription(s)',
        add: '+ New prescription',
        patient: 'Patient',
        doctor: 'Doctor',
        date: 'Prescription date',
        dosages: 'Dosages',
        dosage: 'Dosage',
        medicine: 'Medicine',
        medicinePlaceholder: 'Type or choose a medicine',
        quantity: 'Quantity',
        unit: 'Unit',
        duration: 'Duration',
        moments: 'Dose moments',
        create: 'Create prescription',
        cancel: 'Cancel',
        edit: 'Edit prescription',
        save: 'Save',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        activate: 'Activate',
        deactivate: 'Deactivate',
        remove: 'Remove',
        confirmDelete: 'Delete this prescription?',
        selectPatient: 'Select a patient',
        addDosage: '+ Add dosage',
        empty: 'No prescription found.',
    },
    ar: {
        title: '📋 الوصفات الطبية',
        count: 'وصفة',
        add: '+ وصفة جديدة',
        patient: 'المريض',
        doctor: 'الطبيب',
        date: 'تاريخ الوصفة',
        dosages: 'الجرعات',
        dosage: 'جرعة',
        medicine: 'الدواء',
        medicinePlaceholder: 'اكتب او اختر الدواء',
        quantity: 'الكمية',
        unit: 'الوحدة',
        duration: 'المدة',
        moments: 'أوقات أخذ الدواء',
        create: 'إنشاء الوصفة',
        cancel: 'إلغاء',
        edit: 'تعديل الوصفة',
        save: 'حفظ',
        status: 'الحالة',
        active: 'نشطة',
        inactive: 'غير نشطة',
        activate: 'تفعيل',
        deactivate: 'إيقاف',
        remove: 'حذف',
        confirmDelete: 'هل تريد حذف هذه الوصفة؟',
        selectPatient: 'اختر المريض',
        addDosage: '+ إضافة جرعة',
        empty: 'لا توجد وصفات.',
    },
};

const emptyDosage = {
    medicament_id: '',
    medicament_nom: '',
    duree: 7,
    duree_unite: 'jours',
    quantite: '',
    quantite_unite: 'mg',
    temps_ids: [],
};

const emptyForm = {
    patient_id: '',
    nom_medecin: '',
    date_prescription: '',
};

function DosageForm({ dosages, setDosages, medicaments, temps, errors, t, lang }) {
    const add = () => setDosages([...dosages, { ...emptyDosage }]);
    const remove = (index) => setDosages(dosages.filter((_, i) => i !== index));

    const update = (index, key, value) => {
        const next = [...dosages];
        next[index] = { ...next[index], [key]: value };
        setDosages(next);
    };

    const updateMedicament = (index, value) => {
        const matched = medicaments.find(m => m.nom_commercial?.toLowerCase() === value.trim().toLowerCase());
        const next = [...dosages];
        next[index] = {
            ...next[index],
            medicament_nom: value,
            medicament_id: matched?.id || '',
        };
        setDosages(next);
    };

    const toggleTemps = (index, id) => {
        const next = [...dosages];
        const ids = next[index].temps_ids;
        next[index] = {
            ...next[index],
            temps_ids: ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id],
        };
        setDosages(next);
    };

    return (
        <section style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 4 }}>
            <datalist id="medicament-options">
                {medicaments.map(m => <option key={m.id} value={m.nom_commercial} />)}
            </datalist>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text }}>{t.dosages}</h4>
                <button type="button" onClick={add} style={{ backgroundColor: C.blueSoft, color: C.blue, border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 800, cursor: 'pointer' }}>
                    {t.addDosage}
                </button>
            </div>

            {dosages.map((dosage, index) => (
                <div key={index} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <strong style={{ color: C.text, fontSize: 13 }}>{t.dosage} {index + 1}</strong>
                        {dosages.length > 1 && (
                            <button type="button" onClick={() => remove(index)} style={{ backgroundColor: C.redSoft, color: C.red, border: 'none', borderRadius: 7, padding: '5px 10px', fontWeight: 800, cursor: 'pointer' }}>
                                {t.remove}
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>{t.medicine}</label>
                            <input
                                list="medicament-options"
                                value={dosage.medicament_nom}
                                onChange={e => updateMedicament(index, e.target.value)}
                                placeholder={t.medicinePlaceholder}
                                style={inputStyle(errors[`dosages.${index}.medicament_nom`] || errors[`dosages.${index}.medicament_id`])}
                            />
                            <ErrorText message={errors[`dosages.${index}.medicament_nom`] || errors[`dosages.${index}.medicament_id`]} />
                        </div>

                        <div>
                            <label style={labelStyle}>{t.quantity}</label>
                            <input
                                value={dosage.quantite}
                                onChange={e => update(index, 'quantite', e.target.value)}
                                style={inputStyle(errors[`dosages.${index}.quantite`])}
                            />
                            <ErrorText message={errors[`dosages.${index}.quantite`]} />
                        </div>

                        <div>
                            <label style={labelStyle}>{t.unit}</label>
                            <input
                                value={dosage.quantite_unite}
                                onChange={e => update(index, 'quantite_unite', e.target.value)}
                                style={inputStyle(errors[`dosages.${index}.quantite_unite`])}
                            />
                            <ErrorText message={errors[`dosages.${index}.quantite_unite`]} />
                        </div>

                        <div>
                            <label style={labelStyle}>{t.duration}</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={dosage.duree}
                                    onChange={e => update(index, 'duree', e.target.value)}
                                    style={{ ...inputStyle(errors[`dosages.${index}.duree`]), width: 84 }}
                                />
                                <select value={dosage.duree_unite} onChange={e => update(index, 'duree_unite', e.target.value)} style={inputStyle(errors[`dosages.${index}.duree_unite`])}>
                                    <option value="jours">Jours</option>
                                    <option value="semaines">Semaines</option>
                                    <option value="mois">Mois</option>
                                </select>
                            </div>
                            <ErrorText message={errors[`dosages.${index}.duree`] || errors[`dosages.${index}.duree_unite`]} />
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <label style={labelStyle}>{t.moments}</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {temps.map(item => {
                                const selected = dosage.temps_ids.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleTemps(index, item.id)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: 20,
                                            border: `1px solid ${selected ? C.blue : C.border}`,
                                            backgroundColor: selected ? C.blueSoft : 'rgba(255,255,255,0.04)',
                                            color: selected ? C.blue : C.textMuted,
                                            fontSize: 12,
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {item.nom}
                                    </button>
                                );
                            })}
                        </div>
                        <ErrorText message={errors[`dosages.${index}.temps_ids`]} />
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

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formDosages, setFormDosages] = useState([{ ...emptyDosage }]);

    const patientOptions = useMemo(() => patients.map(patient => ({
        id: patient.id,
        label: `${patient.prenom} ${patient.nom}`,
    })), [patients]);

    const resetAdd = () => {
        setShowAdd(false);
        setForm(emptyForm);
        setFormDosages([{ ...emptyDosage }]);
    };

    const submit = () => {
        router.post('/responsable/ordonnances', { ...form, dosages: formDosages }, {
            preserveScroll: true,
            onSuccess: resetAdd,
        });
    };

    const openEdit = (ordonnance) => {
        setShowEdit({
            id: ordonnance.id,
            nom_medecin: ordonnance.nom_medecin || '',
            date_prescription: ordonnance.date_prescription_raw || '',
            active: ordonnance.active,
        });
    };

    const update = () => {
        router.patch(`/responsable/ordonnances/${showEdit.id}`, showEdit, {
            preserveScroll: true,
            onSuccess: () => setShowEdit(null),
        });
    };

    const destroy = (id) => {
        if (confirm(t.confirmDelete)) {
            router.delete(`/responsable/ordonnances/${id}`);
        }
    };

    const toggleActive = (ordonnance) => {
        router.patch(`/responsable/ordonnances/${ordonnance.id}`, {
            nom_medecin: ordonnance.nom_medecin,
            date_prescription: ordonnance.date_prescription_raw,
            active: !ordonnance.active,
        }, { preserveScroll: true });
    };

    const modalStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: 20,
    };

    const innerStyle = {
        ...glass({ padding: 28 }),
        maxWidth: 720,
        width: '94%',
        maxHeight: '92vh',
        overflowY: 'auto',
        direction: isRtl ? 'rtl' : 'ltr',
    };

    return (
        <AppLayout>
            <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>{t.title}</h1>
                        <p style={{ color: C.textMuted, fontSize: 14, margin: '4px 0 0' }}>{ordonnances.length} {t.count}</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(129,140,248,0.35)' }}>
                        {t.add}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                    {ordonnances.map(ordonnance => (
                        <article key={ordonnance.id} style={{ ...glass({ padding: 18 }) }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{ordonnance.patient}</span>
                                        <span style={{ backgroundColor: ordonnance.active ? C.greenSoft : 'rgba(255,255,255,0.08)', color: ordonnance.active ? C.green : C.textMuted, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                                            {ordonnance.active ? t.active : t.inactive}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: C.textMuted }}>Dr. {ordonnance.nom_medecin || '-'} - {ordonnance.date_prescription}</div>
                                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {ordonnance.medicaments?.map((medicament, index) => (
                                            <span key={index} style={{ backgroundColor: C.blueSoft, color: C.blue, padding: '4px 10px', borderRadius: 18, fontSize: 12, fontWeight: 700 }}>
                                                {medicament.nom} - {medicament.quantite} {medicament.unite} ({medicament.duree})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                                    <button onClick={() => openEdit(ordonnance)} style={{ backgroundColor: C.yellowSoft, color: C.yellow, border: 'none', borderRadius: 8, padding: '7px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{t.edit}</button>
                                    <button onClick={() => toggleActive(ordonnance)} style={{ backgroundColor: C.greenSoft, color: C.green, border: 'none', borderRadius: 8, padding: '7px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                        {ordonnance.active ? t.deactivate : t.activate}
                                    </button>
                                    <button onClick={() => destroy(ordonnance.id)} style={{ backgroundColor: C.redSoft, color: C.red, border: 'none', borderRadius: 8, padding: '7px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{t.remove}</button>
                                </div>
                            </div>
                        </article>
                    ))}

                    {ordonnances.length === 0 && (
                        <div style={{ ...glass({ padding: 32, textAlign: 'center' }) }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                            <p style={{ color: C.textMuted }}>{t.empty}</p>
                        </div>
                    )}
                </div>
            </div>

            {showAdd && (
                <div onClick={resetAdd} style={modalStyle}>
                    <div onClick={event => event.stopPropagation()} style={innerStyle}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 18px', color: C.text }}>{t.add}</h3>

                        <div style={{ marginBottom: 14 }}>
                            <label style={labelStyle}>{t.patient}</label>
                            <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} style={inputStyle(errors.patient_id)}>
                                <option value="">{t.selectPatient}</option>
                                {patientOptions.map(patient => <option key={patient.id} value={patient.id}>{patient.label}</option>)}
                            </select>
                            <ErrorText message={errors.patient_id} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                                <label style={labelStyle}>{t.doctor}</label>
                                <input
                                    value={form.nom_medecin}
                                    onChange={e => setForm({ ...form, nom_medecin: e.target.value })}
                                    style={inputStyle(errors.nom_medecin)}
                                />
                                <ErrorText message={errors.nom_medecin} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t.date}</label>
                                <input type="date" value={form.date_prescription} onChange={e => setForm({ ...form, date_prescription: e.target.value })} style={inputStyle(errors.date_prescription)} />
                                <ErrorText message={errors.date_prescription} />
                            </div>
                        </div>

                        <DosageForm dosages={formDosages} setDosages={setFormDosages} medicaments={medicaments} temps={temps} errors={errors} t={t} lang={lang} />

                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <button onClick={resetAdd} style={{ flex: 1, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 700, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.cancel}</button>
                            <button onClick={submit} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{t.create}</button>
                        </div>
                    </div>
                </div>
            )}

            {showEdit && (
                <div onClick={() => setShowEdit(null)} style={modalStyle}>
                    <div onClick={event => event.stopPropagation()} style={{ ...innerStyle, maxWidth: 560 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 18px', color: C.text }}>{t.edit}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                                <label style={labelStyle}>{t.doctor}</label>
                                <input value={showEdit.nom_medecin} onChange={e => setShowEdit({ ...showEdit, nom_medecin: e.target.value })} style={inputStyle(errors.nom_medecin)} />
                                <ErrorText message={errors.nom_medecin} />
                            </div>
                            <div>
                                <label style={labelStyle}>{t.date}</label>
                                <input type="date" value={showEdit.date_prescription} onChange={e => setShowEdit({ ...showEdit, date_prescription: e.target.value })} style={inputStyle(errors.date_prescription)} />
                                <ErrorText message={errors.date_prescription} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>{t.status}</label>
                            <select value={String(showEdit.active)} onChange={e => setShowEdit({ ...showEdit, active: e.target.value === 'true' })} style={inputStyle(errors.active)}>
                                <option value="true">{t.active}</option>
                                <option value="false">{t.inactive}</option>
                            </select>
                            <ErrorText message={errors.active} />
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowEdit(null)} style={{ flex: 1, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 700, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.cancel}</button>
                            <button onClick={update} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{t.save}</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}