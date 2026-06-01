import { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const c = {
    primaryLight: '#2D5A9E', accent: '#10B981', danger: '#EF4444',
    warning: '#F59E0B', white: '#FFFFFF', text: '#1E293B',
    textMuted: '#64748B', border: '#E2E8F0',
};
const styles = {
    card: { backgroundColor: c.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 16 },
    input: { width: '100%', padding: '10px 14px', border: `1.5px solid ${c.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' },
    label: { display: 'block', fontSize: 13, fontWeight: 600, color: c.textMuted, marginBottom: 6 },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', borderBottom: `2px solid ${c.border}` },
    td: { padding: '12px 16px', fontSize: 14, borderBottom: `1px solid ${c.border}`, verticalAlign: 'middle' },
};

const LIENS = ['fils', 'fille', 'epoux', 'epouse', 'pere', 'mere', 'frere', 'soeur', 'infirmier', 'autre'];

function ConfirmModal({ item, onConfirm, onCancel }) {
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: c.white, borderRadius: 16, padding: 32, maxWidth: 400, width: '90%', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Confirmer la suppression</h3>
                <p style={{ fontSize: 14, color: c.textMuted, marginBottom: 24 }}>Voulez-vous retirer <strong>{item}</strong> de votre liste ?</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button onClick={onCancel} style={{ padding: '8px 20px', border: `1.5px solid ${c.primaryLight}`, borderRadius: 8, backgroundColor: 'transparent', color: c.primaryLight, cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                    <button onClick={onConfirm} style={{ padding: '8px 20px', backgroundColor: c.danger, color: c.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Retirer</button>
                </div>
            </div>
        </div>
    );
}

export default function Patients() {
    const { patients = [], medecins = [] } = usePage().props;
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editPatient, setEditPatient] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const addForm = useForm({
        nom: '', prenom: '', email: '', telephone: '',
        password: '', password_confirmation: '',
        lien: 'autre', date_naissance: '', medecin_id: '',
    });

    const editForm = useForm({
        nom: '', prenom: '', email: '', telephone: '',
        lien: 'autre', etat: 'actif', date_naissance: '', medecin_id: '',
    });

    const openEdit = (p) => {
        setEditPatient(p);
        setShowAdd(false);
        editForm.setData({
            nom: p.nom, prenom: p.prenom, email: p.email,
            telephone: p.telephone, lien: p.lien, etat: p.etat,
            date_naissance: p.date_naissance || '',
            medecin_id: p.medecin_id || '',
        });
        window.scrollTo(0, 0);
    };

    const handleAdd = () => addForm.post('/responsable/patients', {
        onSuccess: () => { addForm.reset(); setShowAdd(false); }
    });
    const handleEdit = () => editForm.put(`/responsable/patients/${editPatient.id}`, {
        onSuccess: () => setEditPatient(null)
    });
    const handleDelete = () => { router.delete(`/responsable/patients/${confirmDelete.id}`); setConfirmDelete(null); };

    const filtered = patients.filter(p =>
        `${p.nom} ${p.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    const MedecinSelect = ({ value, onChange }) => (
        <div>
            <label style={styles.label}>Médecin assigné</label>
            <select style={styles.input} value={value} onChange={onChange}>
                <option value="">-- Aucun médecin --</option>
                {medecins.map(m => (
                    <option key={m.id} value={m.id}>Dr. {m.nom} {m.prenom} — {m.specialite}</option>
                ))}
            </select>
        </div>
    );

    return (
        <AppLayout>
            {confirmDelete && <ConfirmModal item={`${confirmDelete.prenom} ${confirmDelete.nom}`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Gestion des patients</h1>
                    <p style={{ fontSize: 14, color: c.textMuted, margin: '4px 0 0' }}>{patients.length} patient(s) enregistré(s)</p>
                </div>
                <button onClick={() => { setShowAdd(!showAdd); setEditPatient(null); }} style={{ backgroundColor: c.primaryLight, color: c.white, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>
                    {showAdd ? '✕ Fermer' : '+ Ajouter patient'}
                </button>
            </div>

            {/* Formulaire Ajouter */}
            {showAdd && (
                <div style={{ ...styles.card, border: `2px solid ${c.accent}` }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Nouveau patient</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[['nom','Nom'],['prenom','Prénom'],['email','Email'],['telephone','Téléphone']].map(([k,l]) => (
                            <div key={k}>
                                <label style={styles.label}>{l}</label>
                                <input style={styles.input} value={addForm.data[k]} onChange={e => addForm.setData(k, e.target.value)} />
                                {addForm.errors[k] && <p style={{ color: c.danger, fontSize: 12 }}>{addForm.errors[k]}</p>}
                            </div>
                        ))}
                        <div>
                            <label style={styles.label}>Mot de passe</label>
                            <input type="password" style={styles.input} value={addForm.data.password} onChange={e => addForm.setData('password', e.target.value)} />
                        </div>
                        <div>
                            <label style={styles.label}>Confirmer mot de passe</label>
                            <input type="password" style={styles.input} value={addForm.data.password_confirmation} onChange={e => addForm.setData('password_confirmation', e.target.value)} />
                        </div>
                        <div>
                            <label style={styles.label}>Lien avec le patient</label>
                            <select style={styles.input} value={addForm.data.lien} onChange={e => addForm.setData('lien', e.target.value)}>
                                {LIENS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>Date de naissance</label>
                            <input type="date" style={styles.input} value={addForm.data.date_naissance} onChange={e => addForm.setData('date_naissance', e.target.value)} />
                        </div>
                        <MedecinSelect value={addForm.data.medecin_id} onChange={e => addForm.setData('medecin_id', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={handleAdd} disabled={addForm.processing} style={{ backgroundColor: c.primaryLight, color: c.white, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Enregistrer</button>
                        <button onClick={() => setShowAdd(false)} style={{ backgroundColor: 'transparent', color: c.primaryLight, border: `1.5px solid ${c.primaryLight}`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                    </div>
                </div>
            )}

            {/* Formulaire Modifier */}
            {editPatient && (
                <div style={{ ...styles.card, border: `2px solid ${c.warning}` }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: c.warning }}>✏️ Modifier — {editPatient.prenom} {editPatient.nom}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[['nom','Nom'],['prenom','Prénom'],['email','Email'],['telephone','Téléphone']].map(([k,l]) => (
                            <div key={k}>
                                <label style={styles.label}>{l}</label>
                                <input style={styles.input} value={editForm.data[k]} onChange={e => editForm.setData(k, e.target.value)} />
                            </div>
                        ))}
                        <div>
                            <label style={styles.label}>Lien</label>
                            <select style={styles.input} value={editForm.data.lien} onChange={e => editForm.setData('lien', e.target.value)}>
                                {LIENS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>État</label>
                            <select style={styles.input} value={editForm.data.etat} onChange={e => editForm.setData('etat', e.target.value)}>
                                {['actif','inactif','gueri'].map(e => <option key={e}>{e}</option>)}
                            </select>
                        </div>
                        <MedecinSelect value={editForm.data.medecin_id} onChange={e => editForm.setData('medecin_id', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={handleEdit} disabled={editForm.processing} style={{ backgroundColor: c.warning, color: c.white, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>💾 Mettre à jour</button>
                        <button onClick={() => setEditPatient(null)} style={{ backgroundColor: 'transparent', color: c.primaryLight, border: `1.5px solid ${c.primaryLight}`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                    </div>
                </div>
            )}

            {/* Recherche */}
            <div style={{ ...styles.card, padding: '12px 16px' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} style={styles.input} placeholder="🔍 Rechercher par nom ou email..." />
            </div>

            {/* Table */}
            <div style={styles.card}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>{['Nom','Email','Téléphone','Lien','État','Médecin','Adhérence','Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id}>
                                <td style={styles.td}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div><span style={{ fontWeight: 600 }}>{p.prenom} {p.nom}</span></div></td>
                                <td style={{ ...styles.td, color: c.textMuted }}>{p.email}</td>
                                <td style={styles.td}>{p.telephone}</td>
                                <td style={styles.td}><span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.lien}</span></td>
                                <td style={styles.td}><span style={{ backgroundColor: p.etat === 'actif' ? '#D1FAE5' : '#FEE2E2', color: p.etat === 'actif' ? '#059669' : '#DC2626', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.etat}</span></td>
                                <td style={styles.td}>
                                    {p.medecin ? (
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>Dr. {p.medecin.nom} {p.medecin.prenom}</div>
                                            <div style={{ color: c.textMuted, fontSize: 11 }}>{p.medecin.specialite}</div>
                                            <a href={`tel:${p.medecin.telephone}`} style={{ color: c.danger, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>🚨 {p.medecin.telephone}</a>
                                        </div>
                                    ) : <span style={{ color: c.textMuted, fontSize: 12 }}>Non assigné</span>}
                                </td>
                                <td style={styles.td}><span style={{ fontWeight: 700, color: p.adherence >= 80 ? '#059669' : p.adherence >= 60 ? '#D97706' : '#DC2626' }}>{p.adherence}%</span></td>
                                <td style={styles.td}>
                                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 6, fontSize: 16 }}>✏️</button>
                                    <button onClick={() => setConfirmDelete(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <p style={{ textAlign: 'center', color: c.textMuted, padding: 24 }}>Aucun patient trouvé.</p>}
            </div>
        </AppLayout>
    );
}