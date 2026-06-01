import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', accent: '#10B981', danger: '#EF4444',
    white: '#FFFFFF', textMuted: '#64748B', border: '#E2E8F0',
};

const DosageForm = ({ dosages, setDosages, medicaments, temps }) => {
    const add = () => setDosages([...dosages, { medicament_id: '', duree: 7, duree_unite: 'jours', quantite: '', quantite_unite: 'mg', temps_ids: [] }]);
    const remove = (i) => setDosages(dosages.filter((_, idx) => idx !== i));
    const update = (i, key, val) => {
        const d = [...dosages];
        d[i] = { ...d[i], [key]: val };
        setDosages(d);
    };
    const toggleTemps = (i, tid) => {
        const d = [...dosages];
        const ids = d[i].temps_ids.includes(tid) ? d[i].temps_ids.filter(x => x !== tid) : [...d[i].temps_ids, tid];
        d[i] = { ...d[i], temps_ids: ids };
        setDosages(d);
    };

    return (
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 700 }}>💊 Dosages</span>
                <button onClick={add} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Ajouter dosage</button>
            </div>
            {dosages.map((d, i) => (
                <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>Dosage {i + 1}</span>
                        {dosages.length > 1 && <button onClick={() => remove(i)} style={{ backgroundColor: '#FEF2F2', color: colors.danger, border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Supprimer</button>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 4 }}>Médicament</label>
                            <select value={d.medicament_id} onChange={e => update(i, 'medicament_id', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13 }}>
                                <option value="">Sélectionner...</option>
                                {medicaments.map(m => <option key={m.id} value={m.id}>{m.nom_commercial}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 4 }}>Quantité</label>
                            <input value={d.quantite} onChange={e => update(i, 'quantite', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 4 }}>Unité</label>
                            <input value={d.quantite_unite} onChange={e => update(i, 'quantite_unite', e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 4 }}>Durée</label>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <input type="number" value={d.duree} onChange={e => update(i, 'duree', e.target.value)}
                                    style={{ width: 60, padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13 }} />
                                <select value={d.duree_unite} onChange={e => update(i, 'duree_unite', e.target.value)}
                                    style={{ flex: 1, padding: '8px 10px', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13 }}>
                                    <option value="jours">Jours</option>
                                    <option value="semaines">Semaines</option>
                                    <option value="mois">Mois</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Moments de prise</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {temps.map(t => (
                                <button key={t.id} onClick={() => toggleTemps(i, t.id)}
                                    style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                                        backgroundColor: d.temps_ids.includes(t.id) ? colors.primary : '#F1F5F9',
                                        color: d.temps_ids.includes(t.id) ? colors.white : colors.textMuted }}>
                                    {t.nom}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function Ordonnances({ ordonnances, patients, medicaments, temps }) {
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [editDosages, setEditDosages] = useState([]);

    const [form, setForm] = useState({
        patient_id: '', nom_medecin: '', date_prescription: '',
        dosages: [{ medicament_id: '', duree: 7, duree_unite: 'jours', quantite: '', quantite_unite: 'mg', temps_ids: [] }]
    });
    const [formDosages, setFormDosages] = useState(form.dosages);

    const openEdit = (o) => {
        setShowEdit({
            id: o.id,
            nom_medecin: o.nom_medecin,
            date_prescription: o.date_prescription_raw || o.date_prescription,
            active: o.active,
        });
        setEditDosages([{ medicament_id: '', duree: 7, duree_unite: 'jours', quantite: '', quantite_unite: 'mg', temps_ids: [] }]);
    };

    const submit = () => {
        router.post('/responsable/ordonnances', { ...form, dosages: formDosages }, {
            onSuccess: () => { setShowAdd(false); setFormDosages([{ medicament_id: '', duree: 7, duree_unite: 'jours', quantite: '', quantite_unite: 'mg', temps_ids: [] }]); }
        });
    };

    const update = () => {
        router.patch(`/responsable/ordonnances/${showEdit.id}`, {
            nom_medecin: showEdit.nom_medecin,
            date_prescription: showEdit.date_prescription,
            active: showEdit.active,
        }, { onSuccess: () => setShowEdit(null) });
    };

    const destroy = (id) => {
        if (confirm('Supprimer cette ordonnance ?'))
            router.delete(`/responsable/ordonnances/${id}`);
    };
      
  const toggleActive = (o) => {
    router.patch(`/responsable/ordonnances/${o.id}`, {
        nom_medecin: o.nom_medecin,
        date_prescription: o.date_prescription_raw || o.date_prescription,
        active: !o.active,
    }, {
        preserveScroll: true,
        onSuccess: () => router.visit(window.location.href, { 
            preserveScroll: true,
            replace: true 
        }),
    });
};

   // const toggleActive = (o) => {
       // router.patch(`/responsable/ordonnances/${o.id}`, {
           // nom_medecin: o.nom_medecin,
            //date_prescription: o.date_prescription,
            //active: !o.active,
        //}, { preserveScroll: true });
    //};

    const modalStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' };
    const innerStyle = { backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 600, width: '90%', margin: '20px auto', maxHeight: '90vh', overflowY: 'auto' };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>📄 Ordonnances</h1>
                    <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>{ordonnances.length} ordonnance(s)</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                    + Nouvelle ordonnance
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ordonnances.map(o => (
                    <div key={o.id} style={{ backgroundColor: colors.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontWeight: 700, fontSize: 16 }}>{o.patient}</span>
                                    <span style={{ backgroundColor: o.active ? '#D1FAE5' : '#F1F5F9', color: o.active ? '#065F46' : colors.textMuted, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                        {o.active ? '✅ Active' : '⏸️ Inactive'}
                                    </span>
                                </div>
                                <div style={{ fontSize: 13, color: colors.textMuted }}>Dr. {o.nom_medecin} · {o.date_prescription}</div>
                                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {o.medicaments.map((m, i) => (
                                        <span key={i} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                            💊 {m.nom} — {m.quantite} {m.unite} ({m.duree})
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <button onClick={() => openEdit(o)} style={{ backgroundColor: '#FEF9C3', color: '#854D0E', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️ Modifier</button>
                                <button onClick={() => toggleActive(o)} style={{ backgroundColor: '#F0FDF4', color: '#15803D', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                    {o.active ? '⏸️ Désactiver' : '▶️ Activer'}
                                </button>
                                <button onClick={() => destroy(o.id)} style={{ backgroundColor: '#FEF2F2', color: colors.danger, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Ajouter */}
            {showAdd && (
                <div onClick={() => setShowAdd(false)} style={modalStyle}>
                    <div onClick={e => e.stopPropagation()} style={innerStyle}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>📄 Nouvelle ordonnance</h3>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Patient</label>
                            <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })}
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14 }}>
                                <option value="">Sélectionner...</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.user.nom} {p.user.prenom}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Médecin</label>
                                <input value={form.nom_medecin} onChange={e => setForm({ ...form, nom_medecin: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Date prescription</label>
                                <input type="date" value={form.date_prescription} onChange={e => setForm({ ...form, date_prescription: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                            </div>
                        </div>
                        <DosageForm dosages={formDosages} setDosages={setFormDosages} medicaments={medicaments} temps={temps} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 12, border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Annuler</button>
                            <button onClick={submit} style={{ flex: 1, padding: 12, backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Créer ordonnance</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Modifier */}
            {showEdit && (
                <div onClick={() => setShowEdit(null)} style={modalStyle}>
                    <div onClick={e => e.stopPropagation()} style={innerStyle}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>✏️ Modifier ordonnance</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Médecin</label>
                                <input value={showEdit.nom_medecin} onChange={e => setShowEdit({ ...showEdit, nom_medecin: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Date prescription</label>
                                <input type="date" value={showEdit.date_prescription} onChange={e => setShowEdit({ ...showEdit, date_prescription: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Statut</label>
                            <select value={showEdit.active} onChange={e => setShowEdit({ ...showEdit, active: e.target.value === 'true' })}
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14 }}>
                                <option value="true">✅ Active</option>
                                <option value="false">⏸️ Inactive</option>
                            </select>
                        </div>
                        <DosageForm dosages={editDosages} setDosages={setEditDosages} medicaments={medicaments} temps={temps} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowEdit(null)} style={{ flex: 1, padding: 12, border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Annuler</button>
                            <button onClick={update} style={{ flex: 1, padding: 12, backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
