import AppLayout from '../Layout';

const badges = {
    actif:   { bg: '#D1FAE5', color: '#065F46', label: '✅ Actif' },
    inactif: { bg: '#FEF3C7', color: '#92400E', label: '⚠️ Inactif' },
    gueri:   { bg: '#EFF6FF', color: '#1D4ED8', label: '🎉 Guéri' },
};

const liens = {
    fils: '👦 Fils', fille: '👧 Fille', epoux: '👨 Époux', epouse: '👩 Épouse',
    pere: '👨 Père', mere: '👩 Mère', frere: '👦 Frère', soeur: '👧 Sœur',
    infirmier: '🏥 Infirmier/ère', autre: '👤 Autre',
};

export default function Profil({ profil }) {
    const badge = badges[profil.etat] || badges.actif;

    return (
        <AppLayout>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1E293B', margin: 0 }}>👤 Mon Profil</h1>
                <p style={{ color: '#64748B', fontSize: 14, marginTop: 4 }}>Vos informations personnelles</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

                {/* Colonne gauche — Avatar + statut */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Card Avatar */}
                    <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                        <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff', fontWeight: 800, margin: '0 auto 16px' }}>
                            {profil.prenom?.[0]}{profil.nom?.[0]}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B' }}>{profil.prenom} {profil.nom}</div>
                        <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Patient</div>
                        <div style={{ marginTop: 12, display: 'inline-block', backgroundColor: badge.bg, color: badge.color, padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                            {badge.label}
                        </div>
                    </div>

                    {/* Card Responsable */}
                    <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Mon Responsable</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏥</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#1E293B' }}>{profil.responsable}</div>
                                <div style={{ fontSize: 12, color: '#64748B' }}>Responsable médical</div>
                            </div>
                        </div>
                    </div>

                    {/* Message info */}
                    <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#0369A1', lineHeight: 1.5 }}>
                        ℹ️ Pour modifier vos informations, contactez votre responsable.
                    </div>
                </div>

                {/* Colonne droite — Infos détaillées */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Card Coordonnées */}
                    <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>📋 Coordonnées</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {[
                                { label: 'Prénom',    value: profil.prenom,    icon: '👤' },
                                { label: 'Nom',       value: profil.nom,       icon: '👤' },
                                { label: 'Email',     value: profil.email,     icon: '📧' },
                                { label: 'Téléphone', value: profil.telephone, icon: '📞' },
                            ].map(item => (
                                <div key={item.label} style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: '14px 16px' }}>
                                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                        {item.icon} {item.label}
                                    </div>
                                    <div style={{ fontSize: 15, color: '#1E293B', fontWeight: 600 }}>
                                        {item.value || <span style={{ color: '#CBD5E1', fontStyle: 'italic', fontWeight: 400 }}>Non renseigné</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card Infos personnelles */}
                    <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>🏥 Informations médicales</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            {[
                                { label: 'Date de naissance', value: profil.date_naissance, icon: '🎂' },
                                { label: 'Lien familial',     value: liens[profil.lien] || profil.lien, icon: '👨‍👩‍👧' },
                                { label: 'État de santé',     value: profil.etat,           icon: '💊' },
                                { label: 'Adresse',           value: profil.adresse,        icon: '📍' },
                            ].map(item => (
                                <div key={item.label} style={{ backgroundColor: '#F8FAFC', borderRadius: 10, padding: '14px 16px' }}>
                                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                        {item.icon} {item.label}
                                    </div>
                                    <div style={{ fontSize: 15, color: '#1E293B', fontWeight: 600 }}>
                                        {item.value || <span style={{ color: '#CBD5E1', fontStyle: 'italic', fontWeight: 400 }}>Non renseigné</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}