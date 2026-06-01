import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', accent: '#10B981', danger: '#EF4444',
    white: '#FFFFFF', textMuted: '#64748B', border: '#E2E8F0',
};

const empty = { nom: '', prenom: '', specialite: '', telephone: '', email: '' };

const Field = ({ label, fkey, type = 'text', state, setState }) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>{label}</label>
        <input
            type={type}
            value={state[fkey]}
            onChange={e => setState(prev => ({ ...prev, [fkey]: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
        />
    </div>
);

const Modal = ({ title, state, setState, onSave, onClose }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={e => e.stopPropagation()} style={{ backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 440, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{title}</h3>
            <Field label="Nom" fkey="nom" state={state} setState={setState} />
            <Field label="Prénom" fkey="prenom" state={state} setState={setState} />
            <Field label="Spécialité" fkey="specialite" state={state} setState={setState} />
            <Field label="Téléphone" fkey="telephone" type="tel" state={state} setState={setState} />
            <Field label="Email" fkey="email" type="email" state={state} setState={setState} />
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{ flex: 1, padding: 12, border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Annuler</button>
                <button onClick={onSave} style={{ flex: 1, padding: 12, backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Enregistrer</button>
            </div>
        </div>
    </div>
);

export default function Medecins({ medecins }) {
    const [showAdd, setShowAdd]       = useState(false);
    const [showEdit, setShowEdit]     = useState(null);
    const [showDetail, setShowDetail] = useState(null);
    const [form, setForm]             = useState(empty);

    const submit = () => {
        router.post('/responsable/medecins', form, {
            onSuccess: () => { setShowAdd(false); setForm(empty); }
        });
    };

    const update = () => {
        router.patch(`/responsable/medecins/${showEdit.id}`, showEdit, {
            onSuccess: () => setShowEdit(null)
        });
    };

    const destroy = (id) => {
        if (confirm('Supprimer ce médecin ?'))
            router.delete(`/responsable/medecins/${id}`);
    };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🩺 Médecins</h1>
                    <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>{medecins.length} médecin(s)</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                    + Ajouter
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {medecins.map(m => (
                    <div key={m.id} style={{ backgroundColor: colors.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ width: 48, height: 48, backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>👨‍⚕️</div>
                                <div style={{ fontWeight: 800, fontSize: 16 }}>Dr. {m.nom} {m.prenom}</div>
                                <div style={{ color: colors.accent, fontSize: 13, fontWeight: 600 }}>{m.specialite}</div>
                            </div>
                            <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                                {m.patients_count} patient(s)
                            </span>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 13, color: colors.textMuted, lineHeight: 2 }}>
                            <div>📞 <a href={`tel:${m.telephone}`} style={{ color: colors.primary, fontWeight: 600 }}>{m.telephone}</a></div>
                            <div>✉️ {m.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button onClick={() => setShowDetail(m)} style={{ flex: 1, padding: '8px', backgroundColor: '#F0F9FF', color: '#0369A1', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>👁️ Détail</button>
                            <button onClick={() => setShowEdit({ ...m })} style={{ flex: 1, padding: '8px', backgroundColor: '#F0FDF4', color: '#15803D', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️ Modifier</button>
                            <button onClick={() => destroy(m.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#FEF2F2', color: colors.danger, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑️ Suppr.</button>
                        </div>
                    </div>
                ))}
            </div>

            {medecins.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: colors.textMuted }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🩺</div>
                    <p>Aucun médecin enregistré. Cliquez sur + Ajouter.</p>
                </div>
            )}

            {showAdd && (
                <Modal title="➕ Nouveau médecin" state={form} setState={setForm} onSave={submit} onClose={() => setShowAdd(false)} />
            )}
            {showEdit && (
                <Modal title="✏️ Modifier médecin" state={showEdit} setState={setShowEdit} onSave={update} onClose={() => setShowEdit(null)} />
            )}

            {showDetail && (
                <div onClick={() => setShowDetail(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 400, width: '90%' }}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>👨‍⚕️</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Dr. {showDetail.nom} {showDetail.prenom}</h3>
                            <div style={{ color: colors.accent, fontWeight: 600, marginTop: 4 }}>{showDetail.specialite}</div>
                        </div>
                        <div style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 2.2 }}>
                            <div>📞 <strong>Téléphone :</strong> <a href={`tel:${showDetail.telephone}`} style={{ color: colors.primary, fontWeight: 600 }}>{showDetail.telephone}</a></div>
                            <div>✉️ <strong>Email :</strong> {showDetail.email}</div>
                            <div>👥 <strong>Patients :</strong> {showDetail.patients_count}</div>
                        </div>
                        <button onClick={() => setShowDetail(null)} style={{ width: '100%', marginTop: 10, padding: 12, border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Fermer</button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}