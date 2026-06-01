import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    danger: '#EF4444', white: '#FFFFFF',
    textMuted: '#64748B', border: '#E2E8F0', primaryLight: '#2D5A9E',
};

export default function Sos() {
    const { medecin = null } = usePage().props;
    const { data, setData, post, processing, wasSuccessful, reset } = useForm({ message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/patient/sos', { onSuccess: () => reset() });
    };

    return (
        <AppLayout>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🆘 Alerte SOS</h1>

            {/* Médecin assigné */}
            {medecin && (
                <div style={{ backgroundColor: colors.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍⚕️</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>Dr. {medecin.nom} {medecin.prenom}</div>
                            <div style={{ fontSize: 13, color: colors.textMuted }}>{medecin.specialite}</div>
                            <div style={{ fontSize: 13, color: colors.primaryLight, fontWeight: 600 }}>{medecin.telephone}</div>
                        </div>
                    </div>
                    <a href={`tel:${medecin.telephone}`} style={{ padding: '12px 24px', backgroundColor: colors.danger, color: colors.white, borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                        📞 Appeler mon médecin
                    </a>
                </div>
            )}

            {wasSuccessful ? (
                <div style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#065F46' }}>Alerte envoyée !</h3>
                    <p style={{ color: '#047857' }}>Votre responsable a été notifié immédiatement.</p>
                    <button onClick={() => reset()} style={{ marginTop: 16, padding: '10px 24px', backgroundColor: '#10B981', color: colors.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                        Envoyer une autre alerte
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 16, marginBottom: 24, display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>🆘</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: colors.danger }}>Alerte d'urgence</div>
                            <div style={{ fontSize: 13, color: '#7F1D1D' }}>Cette alerte sera immédiatement transmise à votre responsable.</div>
                        </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 6 }}>Message d'urgence</label>
                        <textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Décrivez votre situation d'urgence..."
                            style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${colors.border}`, borderRadius: 8, fontSize: 14, minHeight: 120, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <button type="submit" disabled={processing || !data.message.trim()} style={{ width: '100%', padding: 14, backgroundColor: colors.danger, color: colors.white, border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}>
                        🆘 {processing ? 'Envoi...' : "Envoyer l'alerte SOS"}
                    </button>
                </form>
            )}
        </AppLayout>
    );
}