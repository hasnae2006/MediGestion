import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', accent: '#10B981', danger: '#EF4444',
    white: '#FFFFFF', textMuted: '#64748B', border: '#E2E8F0',
};

const statutStyles = {
    envoye: { bg: '#FEE2E2', color: '#DC2626', label: '🆘 Envoyé' },
    lu:     { bg: '#FEF3C7', color: '#D97706', label: '👁️ Lu' },
    traite: { bg: '#D1FAE5', color: '#065F46', label: '✅ Traité' },
};

const typeStyles = {
    rappel:  { bg: '#EFF6FF', color: '#1D4ED8', icon: '⏰' },
    info:    { bg: '#F0FDF4', color: '#15803D', icon: 'ℹ️' },
    alerte:  { bg: '#FEF2F2', color: '#DC2626', icon: '🚨' },
    message: { bg: '#FDF4FF', color: '#7E22CE', icon: '💬' },
};

const emptyForm = { patient_id: '', type: 'rappel', titre: '', message: '' };

export default function Alertes({ alertes, patients = [] }) {
    const [showSend, setShowSend] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const marquer = (id, statut) => {
        router.patch(`/responsable/alertes/${id}`, { statut }, { preserveScroll: true });
    };

    const envoyer = () => {
        router.post('/responsable/notifications/send', form, {
            preserveScroll: true,
            onSuccess: () => { setShowSend(false); setForm(emptyForm); }
        });
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${colors.border}`,
        borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
    };

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🚨 Alertes SOS</h1>
                    <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>{alertes.length} alerte(s)</p>
                </div>
                <button onClick={() => setShowSend(!showSend)} style={{ backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
                    {showSend ? '✕ Fermer' : '📤 Envoyer notification'}
                </button>
            </div>

            {/* Formulaire envoi notification */}
            {showSend && (
                <div style={{ backgroundColor: colors.white, borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `2px solid ${colors.accent}` }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>📤 Envoyer une notification au patient</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Patient</label>
                            <select style={inputStyle} value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })}>
                                <option value="">-- Choisir un patient --</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Type</label>
                            <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="rappel">⏰ Rappel médicament</option>
                                <option value="info">ℹ️ Information</option>
                                <option value="alerte">🚨 Alerte urgente</option>
                                <option value="message">💬 Message</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Titre</label>
                        <input style={inputStyle} value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Rappel prise du soir" />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 6 }}>Message</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Écrivez votre message ici..." />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => { setShowSend(false); setForm(emptyForm); }} style={{ padding: '10px 20px', border: `1px solid ${colors.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: colors.white }}>Annuler</button>
                        <button onClick={envoyer} disabled={!form.patient_id || !form.titre || !form.message} style={{ padding: '10px 24px', backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', opacity: (!form.patient_id || !form.titre || !form.message) ? 0.5 : 1 }}>
                            📤 Envoyer
                        </button>
                    </div>
                </div>
            )}

            {/* Liste alertes SOS */}
            {alertes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, backgroundColor: colors.white, borderRadius: 12 }}>
                    <div style={{ fontSize: 48 }}>✅</div>
                    <p style={{ color: colors.textMuted, marginTop: 12 }}>Aucune alerte pour le moment</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {alertes.map(a => {
                        const style = statutStyles[a.statut] || statutStyles.envoye;
                        return (
                            <div key={a.id} style={{ backgroundColor: colors.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontWeight: 700, fontSize: 15 }}>{a.patient}</span>
                                        <span style={{ backgroundColor: style.bg, color: style.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{style.label}</span>
                                        <span style={{ color: colors.textMuted, fontSize: 12, marginLeft: 'auto' }}>{a.date}</span>
                                    </div>
                                    <p style={{ color: '#374151', fontSize: 14, margin: 0 }}>{a.message}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                                    {a.statut === 'envoye' && (
                                        <button onClick={() => marquer(a.id, 'lu')} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            👁️ Marquer lu
                                        </button>
                                    )}
                                    {a.statut !== 'traite' && (
                                        <button onClick={() => marquer(a.id, 'traite')} style={{ backgroundColor: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            ✅ Traité
                                        </button>
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