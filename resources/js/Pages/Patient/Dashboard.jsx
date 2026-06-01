import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';

const colors = {
    primary: '#1E3A5F', primaryLight: '#2D5A9E', accent: '#10B981',
    danger: '#EF4444', warning: '#F59E0B',
    white: '#FFFFFF', textMuted: '#64748B', border: '#E2E8F0',
};

const s = {
    card: { backgroundColor: colors.white, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 16 },
};

const formeIcon = { comprime: '💊', sirop: '🧴', injectable: '💉', capsule: '🔵', autre: '💊' };

function StatutBadge({ statut }) {
    if (statut === 'pris')       return <span style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ Pris</span>;
    if (statut === 'en_attente') return <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>⏰ À prendre</span>;
    if (statut === 'manque')     return <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>❌ Oublié</span>;
    return <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>⏳ À venir</span>;
}

function BarreAdherence({ valeur }) {
    const couleur = valeur >= 80 ? colors.accent : valeur >= 60 ? colors.warning : colors.danger;
    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>
                <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <div style={{ backgroundColor: '#E2E8F0', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${valeur}%`, backgroundColor: couleur, height: '100%', borderRadius: 8, transition: 'width 0.5s ease' }} />
            </div>
        </div>
    );
}

export default function PatientDashboard() {
    const { auth, prises: prisesInitiales = [], adherence = 0, medecin = null, prochainePrise = null } = usePage().props;
    const user = auth.user;
    const [prisesState, setPrisesState] = useState(prisesInitiales);
    const [selectedMed, setSelectedMed] = useState(null);

    const confirmerPrise = (id) => {
        router.patch(`/patient/prises/${id}/confirmer`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setPrisesState(prev => prev.map(p => p.id === id ? { ...p, statut: 'pris' } : p));
                setSelectedMed(prev => prev?.id === id ? { ...prev, statut: 'pris' } : prev);
            }
        });
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const prisesRestantes = prisesState.filter(p => p.statut === 'en_attente').length;
    const prisesPrises   = prisesState.filter(p => p.statut === 'pris').length;
    const prisesOubliees = prisesState.filter(p => p.statut === 'manque').length;

    return (
        <AppLayout>
            {/* Banner */}
            <div style={{ ...s.card, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, color: colors.white, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Bonjour {user?.prenom} 👋</h2>
                    <p style={{ opacity: 0.7, fontSize: 14, margin: '0 0 8px' }}>Voici votre programme du jour</p>
                    {prochainePrise && (
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', fontSize: 13, display: 'inline-block' }}>
                            ⏰ Prochaine prise : <strong>{prochainePrise.heure_prevue}</strong> — {prochainePrise.medicament}
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ opacity: 0.8, fontSize: 13, textTransform: 'capitalize', marginBottom: 8 }}>{dateStr}</div>
                    <button onClick={() => router.visit('/patient/sos')} style={{ backgroundColor: colors.danger, color: colors.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                        🆘 SOS
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                {[
                    { n: prisesState.length, label: 'Total',      sub: "Aujourd'hui",    icon: '💊', color: '#3B82F6' },
                    { n: prisesPrises,       label: 'Pris',       sub: 'Bravo !',        icon: '✅', color: '#10B981' },
                    { n: prisesRestantes,    label: 'À prendre',  sub: "N'oubliez pas",  icon: '⏰', color: '#F59E0B' },
                    { n: prisesOubliees,     label: 'Oubliés',    sub: 'Ce mois',        icon: '❌', color: '#EF4444' },
                ].map((stat, i) => (
                    <div key={i} style={{ backgroundColor: colors.white, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.n}</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{stat.label}</div>
                            <div style={{ fontSize: 11, color: colors.textMuted }}>{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
                {/* Programme */}
                <div style={s.card}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Programme du jour</h3>
                    {prisesState.length === 0 && (
                        <p style={{ color: colors.textMuted, textAlign: 'center', padding: 24 }}>Aucune prise prévue aujourd'hui. 🎉</p>
                    )}
                    {prisesState.map((p, i) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < prisesState.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                            <div style={{ minWidth: 52, fontSize: 12, fontWeight: 700, color: colors.primaryLight }}>{p.heure_prevue}</div>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: p.statut === 'pris' ? '#10B981' : p.statut === 'en_attente' ? '#F59E0B' : '#CBD5E1', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer', color: colors.primaryLight, textDecoration: 'underline' }} onClick={() => setSelectedMed(p)}>
                                    {p.medicament}
                                </div>
                                <div style={{ fontSize: 12, color: colors.textMuted }}>{p.quantite} · {p.temps}</div>
                            </div>
                            <StatutBadge statut={p.statut} />
                            {p.statut === 'en_attente' && (
                                <button onClick={() => confirmerPrise(p.id)} style={{ backgroundColor: colors.accent, color: colors.white, border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                                    Confirmer
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Colonne droite */}
                <div>
                    {/* Adhérence */}
                    <div style={s.card}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>📊 Adhérence (30 jours)</h3>
                        <div style={{ fontSize: 32, fontWeight: 800, color: adherence >= 80 ? colors.accent : colors.warning }}>{adherence}%</div>
                        <BarreAdherence valeur={adherence} />
                        <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>
                            {adherence >= 80 ? '🎉 Excellent suivi !' : adherence >= 60 ? '⚠️ Des efforts à faire' : '❌ Pensez à vos médicaments'}
                        </p>
                    </div>

                    {/* Médecin assigné */}
                    {medecin ? (
                        <div style={s.card}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🩺 Mon médecin</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👨‍⚕️</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>Dr. {medecin.nom} {medecin.prenom}</div>
                                    <div style={{ fontSize: 12, color: colors.textMuted }}>{medecin.specialite}</div>
                                </div>
                            </div>
                            <a href={`tel:${medecin.telephone}`} style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#FEF2F2', color: colors.danger, border: `1px solid #FECACA`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
                                📞 {medecin.telephone}
                            </a>
                            <a href={`tel:${medecin.telephone}`} style={{ display: 'block', width: '100%', marginTop: 8, padding: '10px', backgroundColor: colors.danger, color: colors.white, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
                                🚨 Appel d'urgence
                            </a>
                        </div>
                    ) : (
                        <div style={{ ...s.card, textAlign: 'center', color: colors.textMuted }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>🩺</div>
                            <p style={{ fontSize: 13 }}>Aucun médecin assigné</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal medicament */}
            {selectedMed && (
                <div onClick={() => setSelectedMed(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>💊 Détails</h3>
                            <button onClick={() => setSelectedMed(null)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            {selectedMed.photo_boite ? (
                                <img src={`/storage/${selectedMed.photo_boite}`} alt={selectedMed.medicament} style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 12 }} />
                            ) : (
                                <div style={{ width: 100, height: 100, borderRadius: 16, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, margin: '0 auto' }}>
                                    {formeIcon[selectedMed.forme] || '💊'}
                                </div>
                            )}
                        </div>
                        {[
                            { label: 'Médicament', value: selectedMed.medicament,   icon: '💊' },
                            { label: 'Quantité',   value: selectedMed.quantite,     icon: '⚖️' },
                            { label: 'Heure',      value: selectedMed.heure_prevue, icon: '⏰' },
                            { label: 'Moment',     value: selectedMed.temps,        icon: '🕐' },
                            { label: 'Statut',     value: selectedMed.statut === 'en_attente' ? 'À prendre' : selectedMed.statut === 'pris' ? 'Pris ✅' : selectedMed.statut, icon: '📋' },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                                <span style={{ fontSize: 18, width: 28 }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginTop: 2 }}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                        {selectedMed.statut === 'en_attente' && (
                            <button onClick={() => { confirmerPrise(selectedMed.id); setSelectedMed(null); }} style={{ width: '100%', marginTop: 20, padding: 14, backgroundColor: colors.accent, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                                ✅ Confirmer cette prise
                            </button>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}