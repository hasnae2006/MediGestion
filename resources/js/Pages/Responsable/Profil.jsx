import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const pageStyle = {
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '24px',
    boxSizing: 'border-box',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--line) transparent',
};

const inp = (err = false) => ({
    width: '100%', padding: '10px 14px',
    border: err ? '1.5px solid var(--red)' : '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
    background: 'var(--panel-soft)', color: 'var(--text)', outline: 'none',
    colorScheme: 'dark',
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
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{icon} {label}</div>
            {editing ? (
                <div style={{ position: 'relative' }}>
                    <input type={inputType} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inp(!!error), paddingRight: showToggle ? 40 : 14 }} />
                    {showToggle && (
                        <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--muted)' }}>
                            {show ? '🙈' : '👁️'}
                        </button>
                    )}
                    {error && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{error}</div>}
                </div>
            ) : (
                <div style={{ background: 'var(--panel-soft)', borderRadius: 8, padding: '12px 16px', fontSize: 15, color: 'var(--text)', fontWeight: 600, border: '1px solid var(--line)' }}>
                    {value || <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>—</span>}
                </div>
            )}
        </div>
    );
}

export default function ProfilResponsable({ profil }) {
    const lang = useLang();
    const t = profilText[lang] || profilText.fr;
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ prenom: profil?.prenom || '', nom: profil?.nom || '', email: profil?.email || '', telephone: profil?.telephone || '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const set = field => value => { setForm(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: null })); };

    const handleSubmit = () => {
        if (form.password && form.password !== form.password_confirmation) {
            setErrors(prev => ({ ...prev, password_confirmation: t.mdp_mismatch }));
            return;
        }
        const payload = { prenom: form.prenom, nom: form.nom, email: form.email, telephone: form.telephone };
        if (form.password) { payload.password = form.password; payload.password_confirmation = form.password_confirmation; }
        router.put('/responsable/profil', payload, {
            preserveScroll: true,
            onSuccess: () => { setEditing(false); setForm(prev => ({ ...prev, password: '', password_confirmation: '' })); setSuccess(true); setTimeout(() => setSuccess(false), 3000); },
            onError: errs => setErrors(errs),
        });
    };

    const initials = [form.prenom?.[0], form.nom?.[0]].filter(Boolean).join('').toUpperCase() || 'R';

    return (
        <AppLayout>
            <div style={pageStyle}>
            {success && (
                <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: 'var(--teal)', color: '#fff', borderRadius: 10, padding: '12px 20px', fontWeight: 800, fontSize: 14, boxShadow: 'var(--shadow)' }}>✓ {t.succes}</div>
            )}
            <header style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', margin: 0 }}>{t.titre}</h1>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{t.sous_titre}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
                <div style={{ ...cardStyle, padding: 28, textAlign: 'center' }}>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff', fontWeight: 900, margin: '0 auto 14px' }}>{initials}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{form.prenom} {form.nom}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{t.responsable}</div>
                    <div style={{ marginTop: 10, display: 'inline-block', background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: '1px solid var(--line)' }}>🏥 MediGestion</div>
                    <button onClick={() => { setEditing(!editing); setErrors({}); setForm(prev => ({ ...prev, password: '', password_confirmation: '' })); }} style={{ marginTop: 18, width: '100%', padding: '10px 0', borderRadius: 8, border: '1px solid var(--line)', background: editing ? 'var(--panel-soft)' : 'var(--blue)', color: editing ? 'var(--muted)' : '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                        {editing ? t.annuler : t.modifier}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ ...cardStyle, padding: 28 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>{t.coordonnees}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                            <ProfilField label={t.prenom} icon="👤" value={form.prenom} editing={editing} onChange={set('prenom')} error={errors.prenom} />
                            <ProfilField label={t.nom} icon="👤" value={form.nom} editing={editing} onChange={set('nom')} error={errors.nom} />
                            <ProfilField label={t.email} icon="📧" value={form.email} editing={editing} onChange={set('email')} error={errors.email} type="email" />
                            <ProfilField label={t.telephone} icon="📞" value={form.telephone} editing={editing} onChange={set('telephone')} error={errors.telephone} type="tel" />
                        </div>
                    </div>
                    {editing && (
                        <div style={{ ...cardStyle, padding: 28 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>{t.securite}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <ProfilField label={t.mot_de_passe} icon="🔒" value={form.password} editing onChange={set('password')} placeholder={t.mdp_placeholder} error={errors.password} showToggle />
                                <ProfilField label={t.confirmer_mdp} icon="🔒" value={form.password_confirmation} editing onChange={set('password_confirmation')} placeholder={t.mdp_placeholder} error={errors.password_confirmation} showToggle />
                            </div>
                        </div>
                    )}
                    {editing && (
                        <button onClick={handleSubmit} style={{ alignSelf: 'flex-start', padding: '12px 32px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                            ✓ {t.enregistrer}
                        </button>
                    )}
                </div>
            </div>
            </div>
        </AppLayout>
    );
}
