import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const text = {
    fr: {
        titre: '👤 Mon Profil', sous_titre: 'Vos informations personnelles',
        patient: 'Patient', mon_responsable: 'Mon Responsable', responsable_label: 'Responsable médical',
        info: 'ℹ️ Pour modifier vos informations, contactez votre responsable.',
        coordonnees: '📋 Coordonnées', infos_medicales: '🏥 Informations médicales',
        prenom: 'Prénom', nom: 'Nom', email: 'Email', telephone: 'Téléphone',
        date_naissance: 'Date de naissance', lien: 'Lien familial', etat: 'État de santé', adresse: 'Adresse',
        non_renseigne: 'Non renseigné',
        badges: { actif: '✅ Actif', inactif: '⚠️ Inactif', gueri: '🎉 Guéri' },
        liens: { fils: '👦 Fils', fille: '👧 Fille', epoux: '👨 Époux', epouse: '👩 Épouse', pere: '👨 Père', mere: '👩 Mère', frere: '👦 Frère', soeur: '👧 Sœur', infirmier: '🏥 Infirmier/ère', autre: '👤 Autre' },
    },
    en: {
        titre: '👤 My Profile', sous_titre: 'Your personal information',
        patient: 'Patient', mon_responsable: 'My Supervisor', responsable_label: 'Medical supervisor',
        info: 'ℹ️ To update your information, contact your supervisor.',
        coordonnees: '📋 Contact Info', infos_medicales: '🏥 Medical Information',
        prenom: 'First name', nom: 'Last name', email: 'Email', telephone: 'Phone',
        date_naissance: 'Date of birth', lien: 'Family link', etat: 'Health status', adresse: 'Address',
        non_renseigne: 'Not provided',
        badges: { actif: '✅ Active', inactif: '⚠️ Inactive', gueri: '🎉 Recovered' },
        liens: { fils: '👦 Son', fille: '👧 Daughter', epoux: '👨 Husband', epouse: '👩 Wife', pere: '👨 Father', mere: '👩 Mother', frere: '👦 Brother', soeur: '👧 Sister', infirmier: '🏥 Nurse', autre: '👤 Other' },
    },
    ar: {
        titre: '👤 ملفي الشخصي', sous_titre: 'معلوماتك الشخصية',
        patient: 'مريض', mon_responsable: 'مسؤولي', responsable_label: 'المسؤول الطبي',
        info: 'ℹ️ لتعديل معلوماتك، تواصل مع مسؤولك.',
        coordonnees: '📋 معلومات الاتصال', infos_medicales: '🏥 المعلومات الطبية',
        prenom: 'الاسم', nom: 'اللقب', email: 'البريد الإلكتروني', telephone: 'الهاتف',
        date_naissance: 'تاريخ الميلاد', lien: 'الصلة العائلية', etat: 'الحالة الصحية', adresse: 'العنوان',
        non_renseigne: 'غير محدد',
        badges: { actif: '✅ نشط', inactif: '⚠️ غير نشط', gueri: '🎉 تعافى' },
        liens: { fils: '👦 ابن', fille: '👧 ابنة', epoux: '👨 زوج', epouse: '👩 زوجة', pere: '👨 أب', mere: '👩 أم', frere: '👦 أخ', soeur: '👧 أخت', infirmier: '🏥 ممرض', autre: '👤 أخرى' },
    },
};

const badgeColors = {
    actif:   { bg: 'rgba(20,184,166,0.1)',   color: 'var(--teal)'  },
    inactif: { bg: 'rgba(245,158,11,.1)',    color: 'var(--amber)' },
    gueri:   { bg: 'rgba(99,102,241,0.1)',   color: 'var(--blue)'  },
};

export default function Profil({ profil }) {
    const lang = useLang();
    const t = text[lang] || text.fr;
    const isRtl = lang === 'ar';

    const badge      = badgeColors[profil?.etat] || badgeColors.actif;
    const badgeLabel = t.badges[profil?.etat]    || t.badges.actif;

    return (
        <AppLayout>
            <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <header style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.titre}</h1>
                    <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{t.sous_titre}</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ ...cardStyle, padding: 32, textAlign: 'center' }}>
                            <div style={{
                                width: 100, height: 100, borderRadius: '50%',
                                background: 'var(--teal)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 36, color: '#fff', fontWeight: 900,
                                margin: '0 auto 16px',
                            }}>
                                {profil?.prenom?.[0]}{profil?.nom?.[0]}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>
                                {profil?.prenom} {profil?.nom}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{t.patient}</div>
                            <div style={{
                                marginTop: 12, display: 'inline-block',
                                background: badge.bg, color: badge.color,
                                padding: '4px 14px', borderRadius: 20,
                                fontSize: 13, fontWeight: 800,
                            }}>
                                {badgeLabel}
                            </div>
                        </div>
                        <div style={{ ...cardStyle, padding: 24 }}>
                            <div style={lbl}>{t.mon_responsable}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'rgba(99,102,241,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                                }}>🏥</div>
                                <div>
                                    <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--text)' }}>
                                        {profil?.responsable || '—'}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.responsable_label}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            ...cardStyle,
                            padding: '14px 16px',
                            background: 'rgba(99,102,241,0.08)',
                            borderLeft: '3px solid var(--blue)',
                            borderRadius: 0,
                            fontSize: 13, color: 'var(--blue)', lineHeight: 1.6,
                        }}>
                            {t.info}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ ...cardStyle, padding: 28 }}>
                            <div style={{ ...lbl, marginBottom: 20 }}>{t.coordonnees}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { label: t.prenom,    value: profil?.prenom,    icon: '👤' },
                                    { label: t.nom,       value: profil?.nom,       icon: '👤' },
                                    { label: t.email,     value: profil?.email,     icon: '📧' },
                                    { label: t.telephone, value: profil?.telephone, icon: '📞' },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        background: 'var(--panel-soft)',
                                        border: '1px solid var(--line)',
                                        borderRadius: 8, padding: '14px 16px',
                                    }}>
                                        <div style={{ ...lbl, marginBottom: 6 }}>{item.icon} {item.label}</div>
                                        <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 800 }}>
                                            {item.value || (
                                                <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>
                                                    {t.non_renseigne}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ ...cardStyle, padding: 28 }}>
                            <div style={{ ...lbl, marginBottom: 20 }}>{t.infos_medicales}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { label: t.date_naissance, value: profil?.date_naissance,               icon: '🎂' },
                                    { label: t.lien,           value: t.liens[profil?.lien] || profil?.lien, icon: '👨‍👩‍👧' },
                                    { label: t.etat,           value: badgeLabel,                            icon: '💊' },
                                    { label: t.adresse,        value: profil?.adresse,                       icon: '📍' },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        background: 'var(--panel-soft)',
                                        border: '1px solid var(--line)',
                                        borderRadius: 8, padding: '14px 16px',
                                    }}>
                                        <div style={{ ...lbl, marginBottom: 6 }}>{item.icon} {item.label}</div>
                                        <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 800 }}>
                                            {item.value || (
                                                <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>
                                                    {t.non_renseigne}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
