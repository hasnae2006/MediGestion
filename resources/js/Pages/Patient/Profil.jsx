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
    actif:   { bg: C.greenSoft, color: C.green },
    inactif: { bg: C.yellowSoft, color: C.yellow },
    gueri:   { bg: C.blueSoft, color: C.blue },
};

export default function Profil({ profil }) {
    const lang = useLang();
    const t = text[lang] || text.fr;
    const isRtl = lang === 'ar';
    
    const badge = badgeColors[profil?.etat] || badgeColors.actif;
    const badgeLabel = t.badges[profil?.etat] || t.badges.actif;

    return (
        <AppLayout>
            <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0 }}>{t.titre}</h1>
                    <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{t.sous_titre}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Avatar Card */}
                        <div style={{ ...glass({ padding: 32, textAlign: 'center' }) }}>
                            <div style={{
                                width: 100, height: 100, borderRadius: '50%',
                                background: 'linear-gradient(135deg,#818CF8,#A78BFA)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 36, color: '#0F1535', fontWeight: 800,
                                margin: '0 auto 16px', boxShadow: '0 4px 15px rgba(129,140,248,0.3)'
                            }}>
                                {profil?.prenom?.[0]}{profil?.nom?.[0]}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{profil?.prenom} {profil?.nom}</div>
                            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{t.patient}</div>
                            <div style={{ marginTop: 12, display: 'inline-block', backgroundColor: badge.bg, color: badge.color, padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                                {badgeLabel}
                            </div>
                        </div>

                        {/* Responsible Card */}
                        <div style={{ ...glass({ padding: 24 }) }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                                {t.mon_responsable}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: C.blueSoft, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: 22
                                }}>🏥</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{profil?.responsable || '—'}</div>
                                    <div style={{ fontSize: 12, color: C.textMuted }}>{t.responsable_label}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            ...glass({ padding: '14px 16px' }),
                            backgroundColor: C.blueSoft,
                            borderLeft: `3px solid ${C.blue}`,
                            fontSize: 13, color: C.blue, lineHeight: 1.5
                        }}>
                            {t.info}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Contact Info */}
                        <div style={{ ...glass({ padding: 28 }) }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>
                                {t.coordonnees}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                {[
                                    { label: t.prenom,    value: profil?.prenom,    icon: '👤' },
                                    { label: t.nom,       value: profil?.nom,       icon: '👤' },
                                    { label: t.email,     value: profil?.email,     icon: '📧' },
                                    { label: t.telephone, value: profil?.telephone, icon: '📞' },
                                ].map(item => (
                                    <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 16px', border: `1px solid ${C.borderLight}` }}>
                                        <div style={{ fontSize: 11, color: C.textHint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                            {item.icon} {item.label}
                                        </div>
                                        <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>
                                            {item.value || <span style={{ color: C.textHint, fontStyle: 'italic', fontWeight: 400 }}>{t.non_renseigne}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ ...glass({ padding: 28 }) }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>
                                {t.infos_medicales}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                {[
                                    { label: t.date_naissance, value: profil?.date_naissance,          icon: '🎂' },
                                    { label: t.lien,           value: t.liens[profil?.lien] || profil?.lien, icon: '👨‍👩‍👧' },
                                    { label: t.etat,           value: badgeLabel,                      icon: '💊' },
                                    { label: t.adresse,        value: profil?.adresse,                 icon: '📍' },
                                ].map(item => (
                                    <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 16px', border: `1px solid ${C.borderLight}` }}>
                                        <div style={{ fontSize: 11, color: C.textHint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                            {item.icon} {item.label}
                                        </div>
                                        <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>
                                            {item.value || <span style={{ color: C.textHint, fontStyle: 'italic', fontWeight: 400 }}>{t.non_renseigne}</span>}
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