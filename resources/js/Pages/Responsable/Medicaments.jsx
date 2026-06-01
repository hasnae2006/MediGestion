import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', accent: '#10B981', danger: '#EF4444',
    white: '#FFFFFF', textMuted: '#64748B', border: '#E2E8F0',
};

const formeLabels = {
    comprime: '💊 Comprimé', sirop: '🧴 Sirop', injectable: '💉 Injectable',
    capsule: '🔵 Capsule', autre: '💊 Autre'
};

export default function Medicaments({ medicaments }) {
    const { flash } = usePage().props;
    const [showAdd, setShowAdd] = useState(false);
    const [showStock, setShowStock] = useState(null);
    const [showEdit, setShowEdit] = useState(null);
    const [form, setForm] = useState({ nom_commercial: '', forme: 'comprime', quantite_stock: 0 });
    const [stockQty, setStockQty] = useState(1);

    const submit = () => {
        router.post('/responsable/medicaments', form, {
            onSuccess: () => { setShowAdd(false); setForm({ nom_commercial: '', forme: 'comprime', quantite_stock: 0 }); }
        });
    };

    const update = () => {
        router.patch(`/responsable/medicaments/${showEdit.id}`, showEdit, {
            onSuccess: () => setShowEdit(null)
        });
    };

    const destroy = (id) => {
        if (confirm('Supprimer ce médicament ?'))
            router.delete(`/responsable/medicaments/${id}`);
    };

    const reappro = () => {
        router.patch(`/responsable/medicaments/${showStock.id}/stock`, { quantite: stockQty }, {
            onSuccess: () => setShowStock(null)
        });
    };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>💊 Médicaments</h1>
                    <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>{medicaments.length} médicament(s)</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                    + Ajouter
                </button>
            </div>

            <div style={{ backgroundColor: colors.white, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F8FAFC' }}>
                            {['Médicament', 'Forme', 'Stock', 'Statut', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {medicaments.map((m, i) => (
                            <tr key={m.id} style={{ borderTop: i > 0 ? `1px solid ${colors.border}` : 'none' }}>
                                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{m.nom_commercial}</td>
                                <td style={{ padding: '14px 16px', color: colors.textMuted }}>{formeLabels[m.forme]}</td>
                                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{m.quantite_stock}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    {m.stock_faible
                                        ? <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>⚠️ Faible</span>
                                        : <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✅ OK</span>
                                    }
                                </td>
                                <td style={{ padding: '14px 16px', display: 'flex', gap: 8 }}>
                                    <button onClick={() => { setShowStock(m); setStockQty(1); }} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📦 Stock</button>
                                    <button onClick={() => setShowEdit({ ...m })} style={{ backgroundColor: '#F0FDF4', color: '#15803D', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => destroy(m.id)} style={{ backgroundColor: '#FEF2F2', color: colors.danger, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Ajouter */}
            {showAdd && (
                <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 420, width: '90%' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>➕ Nouveau médicament</h3>
                        {[
                            { label: 'Nom commercial', key: 'nom_commercial', type: 'text' },
                            { label: 'Stock initial', key: 'quantite_stock', type: 'number' },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>{f.label}</label>
                                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Forme</label>
                            <select value={form.forme} onChange={e => setForm({ ...form, forme: e.target.value })}
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14 }}>
                                {Object.entries(formeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 12, border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Annuler</button>
                            <button onClick={submit} style={{ flex: 1, padding: 12, backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Ajouter</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Stock */}
            {showStock && (
                <div onClick={() => setShowStock(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 360, width: '90%' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>📦 Réapprovisionner</h3>
                        <p style={{ color: colors.textMuted, marginBottom: 20 }}>{showStock.nom_commercial} — Stock actuel : <strong>{showStock.quantite_stock}</strong></p>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Quantité à ajouter</label>
                        <input type="number" min="1" value={stockQty} onChange={e => setStockQty(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 20 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowStock(null)} style={{ flex: 1, padding: 12, border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Annuler</button>
                            <button onClick={reappro} style={{ flex: 1, padding: 12, backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Confirmer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {showEdit && (
                <div onClick={() => setShowEdit(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 420, width: '90%' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>✏️ Modifier médicament</h3>
                        {[
                            { label: 'Nom commercial', key: 'nom_commercial', type: 'text' },
                            { label: 'Stock', key: 'quantite_stock', type: 'number' },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>{f.label}</label>
                                <input type={f.type} value={showEdit[f.key]} onChange={e => setShowEdit({ ...showEdit, [f.key]: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Forme</label>
                            <select value={showEdit.forme} onChange={e => setShowEdit({ ...showEdit, forme: e.target.value })}
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14 }}>
                                {Object.entries(formeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
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
