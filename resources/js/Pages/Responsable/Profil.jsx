import { useState } from 'react';
import { router } from '@inertiajs/react';
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

const inp = (err = false) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${err ? C.red : C.border}`,
    borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: C.text, outline: 'none',
});

const profilText = {
    fr: { titre: '👤 Mon Profil', sous_titre: 'Vos informations personnelles', responsable: 'Responsable', coordonnees: '📋 Coordonnées', securite: '🔒 Sécurité', prenom: 'Prénom', nom: 'Nom', email: 'Email', telephone: 'Téléphone', mot_de_passe: 'Nouveau mot de passe', confirmer_mdp: 'Confirmer le mot de passe', mdp_placeholder: 'Laisser vide pour ne pas changer', modifier: '✏️ Modifier', annuler: 'Annuler', enregistrer: 'Enregistrer', succes: 'Profil mis à jour avec succès.', mdp_mismatch: 'Les mots de passe ne correspondent pas.' },
    en: { titre: '👤 My Profile', sous_titre: 'Your personal information', responsable: 'Supervisor', coordonnees: '📋 Contact Info', securite: '🔒 Security', prenom: 'First name', nom: 'Last name', email: 'Email', telephone: 'Phone', mot_de_passe: 'New password', confirmer_mdp: 'Confirm password', mdp_placeholder: 'Leave blank to keep current', modifier: '✏️ Edit', annuler: 'Cancel', enregistrer: 'Save', succes: 'Profile updated successfully.', mdp_mismatch: 'Passwords do not match.' },
    ar: { titre: '👤 ملفي الشخصي', sous_titre: 'معلوماتك الشخصية', responsable: 'مسؤول', coordonnees: '📋 معلومات الاتصال', securite: '🔒 الأمان', prenom: 'الاسم', nom: 'اللقب', email: 'البريد الإلكتروني', telephone: 'الهاتف', mot_de_passe: 'كلمة المرور الجديدة', confirmer_mdp: 'تأكيد كلمة المرور', mdp_placeholder: 'اتركه فارغاً', modifier: '✏️ تعديل', annuler: 'إلغاء', enregistrer: 'حفظ', succes: 'تم تحديث الملف الشخصي بنجاح.', mdp_mismatch: 'كلمتا المرور غير متطابقتين.' },
};

function ProfilField({ label, icon, value, editing, onChange, type = 'text', placeholder = '', error, showToggle = false }) {
    const [show, setShow] = useState(false);
    const inputType = showToggle ? (show ? 'text' : 'password') : type;
    return (
        <div>
            <div style={{ fontSize: 11, color: C.textHint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{icon} {label}</div>
            {editing ? (
                <div style={{ position: 'relative' }}>
                    <input type={inputType} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                        style={{ ...inp(!!error), paddingRight: showToggle ? 40 : 14, transition: 'border .15s' }} />
                    {showToggle && (
                        <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.textHint }}>
                            {show ? '🙈' : '👁️'}
                        </button>
                    )}
                    {error && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>}
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: C.text, fontWeight: 600, border: `1px solid ${C.borderLight}` }}>
                    {value || <span style={{ color: C.textHint, fontStyle: 'italic', fontWeight: 400 }}>{'—'}</span>}
                </div>
            )}
        </div>
    );
}

export default function ProfilResponsable({ profil }) {
    const lang = useLang();
    const t = profilText[lang] || profilText.fr;
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ 
        prenom: profil?.prenom || '', 
        nom: profil?.nom || '', 
        email: profil?.email || '', 
        telephone: profil?.telephone || '', 
        password: '', 
        password_confirmation: '' 
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const set = field => value => { 
        setForm(prev => ({ ...prev, [field]: value })); 
        setErrors(prev => ({ ...prev, [field]: null })); 
    };

    const handleSubmit = () => {
        if (form.password && form.password !== form.password_confirmation) {
            setErrors(prev => ({ ...prev, password_confirmation: t.mdp_mismatch }));
            return;
        }
        const payload = { prenom: form.prenom, nom: form.nom, email: form.email, telephone: form.telephone };
        if (form.password) { 
            payload.password = form.password; 
            payload.password_confirmation = form.password_confirmation; 
        }
        router.put('/responsable/profil', payload, {
            preserveScroll: true,
            onSuccess: () => { 
                setEditing(false); 
                setForm(prev => ({ ...prev, password: '', password_confirmation: '' })); 
                setSuccess(true); 
                setTimeout(() => setSuccess(false), 3000); 
            },
            onError: errs => setErrors(errs),
        });
    };

    const initials = [form.prenom?.[0], form.nom?.[0]].filter(Boolean).join('').toUpperCase() || 'R';

    return (
        <AppLayout>
            {success && (
                <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: 'linear-gradient(135deg,#34D399,#059669)', color: '#fff', borderRadius: 10, padding: '12px 20px', fontWeight: 700, fontSize: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>✓ {t.succes}</div>
            )}

            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0 }}>{t.titre}</h1>
                <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{t.sous_titre}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
                <div style={glass({ padding: 28, textAlign: 'center' })}>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#818CF8,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#0F1535', fontWeight: 800, margin: '0 auto 14px', boxShadow: '0 8px 25px rgba(129,140,248,0.4)' }}>{initials}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{form.prenom} {form.nom}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{t.responsable}</div>
                    <div style={{ marginTop: 10, display: 'inline-block', background: C.blueSoft, color: C.blue, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: `1px solid rgba(129,140,248,0.3)` }}>🏥 MediGestion</div>
                    <button onClick={() => { setEditing(!editing); setErrors({}); setForm(prev => ({ ...prev, password: '', password_confirmation: '' })); }} style={{ marginTop: 18, width: '100%', padding: '10px 0', borderRadius: 10, border: `1px solid ${editing ? C.border : 'transparent'}`, background: editing ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#818CF8,#6366F1)', color: editing ? C.textMuted : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s' }}>
                        {editing ? t.annuler : t.modifier}
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={glass({ padding: 28 })}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>{t.coordonnees}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                            <ProfilField label={t.prenom} icon="👤" value={form.prenom} editing={editing} onChange={set('prenom')} error={errors.prenom} />
                            <ProfilField label={t.nom} icon="👤" value={form.nom} editing={editing} onChange={set('nom')} error={errors.nom} />
                            <ProfilField label={t.email} icon="📧" value={form.email} editing={editing} onChange={set('email')} error={errors.email} type="email" />
                            <ProfilField label={t.telephone} icon="📞" value={form.telephone} editing={editing} onChange={set('telephone')} error={errors.telephone} type="tel" />
                        </div>
                    </div>

                    {editing && (
                        <div style={glass({ padding: 28 })}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>{t.securite}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <ProfilField label={t.mot_de_passe} icon="🔒" value={form.password} editing={true} onChange={set('password')} placeholder={t.mdp_placeholder} error={errors.password} showToggle />
                                <ProfilField label={t.confirmer_mdp} icon="🔒" value={form.password_confirmation} editing={true} onChange={set('password_confirmation')} placeholder={t.mdp_placeholder} error={errors.password_confirmation} showToggle />
                            </div>
                        </div>
                    )}

                    {editing && (
                        <button onClick={handleSubmit} style={{ alignSelf: 'flex-start', padding: '12px 32px', background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 15px rgba(129,140,248,0.35)' }}>
                            ✓ {t.enregistrer}
                        </button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}