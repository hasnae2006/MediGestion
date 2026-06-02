import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
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
    borderRadius: 18,
    border: `1px solid ${C.border}`,
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    ...extra,
});

const inputStyle = (hasError) => ({
    width: '100%',
    padding: '11px 14px',
    border: `1.5px solid ${hasError ? C.red : C.border}`,
    borderRadius: 10,
    fontSize: 14,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    outline: 'none',
    color: C.text,
    transition: 'all 0.2s',
});

const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: C.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{label}</label>
            {children}
            {error && <p style={{ color: C.red, fontSize: 12, margin: '4px 0 0' }}>{error}</p>}
        </div>
    );
}
const translations = {
    FR: {
        dir: 'ltr',
        pageTitle: 'Inscription',
        heading: 'Inscription MediGestion',
        subheading: 'Créez un compte patient ou responsable.',
        nom: 'Nom',
        prenom: 'Prénom',
        telephone: 'Téléphone',
        email: 'Email',
        password: 'Mot de passe',
        confirmation: 'Confirmation',
        typeCompte: 'Type de compte',
        patient: 'Patient',
        responsable: 'Responsable',
        dateNaissance: 'Date de naissance',
        lien: 'Lien',
        responsableLabel: 'Responsable',
        adresse: 'Adresse',
        choisirResponsable: 'Choisir un responsable',
        creating: 'Création...',
        submit: 'Créer le compte',
        alreadyAccount: 'Déjà un compte ?',
        login: 'Connexion',
        nomTitle: 'Lettres, espaces, tirets ou apostrophes seulement',
        telTitle: 'Exemple: 0612345678 ou +212612345678',
        passwordTitle: 'Minimum 8 caractères avec au moins une lettre et un chiffre',
        liens: ['fils', 'fille', 'époux', 'épouse', 'père', 'mère', 'frère', 'sœur', 'infirmier', 'autre'],
    },
    EN: {
        dir: 'ltr',
        pageTitle: 'Register',
        heading: 'MediGestion Registration',
        subheading: 'Create a patient or caregiver account.',
        nom: 'Last Name',
        prenom: 'First Name',
        telephone: 'Phone',
        email: 'Email',
        password: 'Password',
        confirmation: 'Confirm Password',
        typeCompte: 'Account Type',
        patient: 'Patient',
        responsable: 'Caregiver',
        dateNaissance: 'Date of Birth',
        lien: 'Relationship',
        responsableLabel: 'Caregiver',
        adresse: 'Address',
        choisirResponsable: 'Choose a caregiver',
        creating: 'Creating...',
        submit: 'Create Account',
        alreadyAccount: 'Already have an account?',
        login: 'Sign In',
        nomTitle: 'Letters, spaces, hyphens or apostrophes only',
        telTitle: 'Example: 0612345678 or +212612345678',
        passwordTitle: 'Minimum 8 characters with at least one letter and one number',
        liens: ['son', 'daughter', 'husband', 'wife', 'father', 'mother', 'brother', 'sister', 'nurse', 'other'],
    },
    AR: {
        dir: 'rtl',
        pageTitle: 'التسجيل',
        heading: 'التسجيل في MediGestion',
        subheading: 'أنشئ حساب مريض أو مسؤول.',
        nom: 'الاسم العائلي',
        prenom: 'الاسم الشخصي',
        telephone: 'الهاتف',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmation: 'تأكيد كلمة المرور',
        typeCompte: 'نوع الحساب',
        patient: 'مريض',
        responsable: 'مسؤول',
        dateNaissance: 'تاريخ الميلاد',
        lien: 'صلة القرابة',
        responsableLabel: 'المسؤول',
        adresse: 'العنوان',
        choisirResponsable: 'اختر مسؤولاً',
        creating: '...جاري الإنشاء',
        submit: 'إنشاء الحساب',
        alreadyAccount: 'هل لديك حساب؟',
        login: 'تسجيل الدخول',
        nomTitle: 'أحرف ومسافات وشرطات أو فواصل عليا فقط',
        telTitle: 'مثال: 0612345678 أو +212612345678',
        passwordTitle: 'الحد الأدنى 8 أحرف مع حرف ورقم على الأقل',
        liens: ['ابن', 'ابنة', 'زوج', 'زوجة', 'أب', 'أم', 'أخ', 'أخت', 'ممرض', 'آخر'],
    },
};

const LANG_BUTTONS = [
    { code: 'FR', flag: '🇫🇷', label: 'FR' },
    { code: 'EN', flag: '🇬🇧', label: 'EN' },
    { code: 'AR', flag: '🇲🇦', label: 'ع' },
];
function LangSwitcher({ lang, setLang }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginBottom: 8,
        }}>
            {LANG_BUTTONS.map(({ code, flag, label }) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '6px 13px',
                        borderRadius: 8,
                        border: `1.5px solid ${lang === code ? C.blue : C.border}`,
                        backgroundColor: lang === code ? C.blueSoft : 'rgba(255,255,255,0.04)',
                        color: lang === code ? C.blue : C.textMuted,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    <span style={{ fontSize: 15 }}>{flag}</span>
                    {label}
                </button>
            ))}
        </div>
    );
}
export default function Register({ responsables = [] }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('register_lang') || 'FR';
    });
    const t = translations[lang];
    const isRtl = lang === 'AR';

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        role: 'patient',
        password: '',
        password_confirmation: '',
        date_naissance: '',
        lien: 'autre',
        adresse: '',
        responsable_id: responsables[0]?.id ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const setLanguage = (code) => {
        localStorage.setItem('register_lang', code);
        setLang(code);
    };

    // Get relationship options in the correct language
    const getLienOptions = () => {
        const frLiens = translations.FR.liens;
        return t.liens.map((lien, index) => ({
            value: frLiens[index],
            label: lien
        }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: C.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            fontFamily: "'Nunito','Segoe UI',sans-serif",
        }}>
            <Head title={t.pageTitle} />

            <div style={{ width: 800, maxWidth: '96vw' }}>
                <LangSwitcher lang={lang} setLang={setLanguage} />

                <div
                    dir={isRtl ? 'rtl' : 'ltr'}
                    style={{ ...glass({ padding: 0, overflow: 'hidden' }) }}
                >
                    {/* Header with gradient */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(129,140,248,0.2), rgba(167,139,250,0.1))',
                        padding: '28px 34px',
                        borderBottom: `1px solid ${C.border}`,
                    }}>
                        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.text }}>{t.heading}</h1>
                        <p style={{ margin: '6px 0 0', color: C.textMuted, fontSize: 14 }}>{t.subheading}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} style={{ padding: 34 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                            <Field label={t.nom} error={errors.nom}>
                                <input
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    pattern="[A-Za-z\s'-]{2,100}"
                                    title={t.nomTitle}
                                    required
                                    style={inputStyle(errors.nom)}
                                />
                            </Field>

                            <Field label={t.prenom} error={errors.prenom}>
                                <input
                                    value={data.prenom}
                                    onChange={(e) => setData('prenom', e.target.value)}
                                    pattern="[A-Za-z\s'-]{2,100}"
                                    title={t.nomTitle}
                                    required
                                    style={inputStyle(errors.prenom)}
                                />
                            </Field>

                            <Field label={t.telephone} error={errors.telephone}>
                                <input
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    pattern="(\+212|0)[5-7][0-9]{8}"
                                    title={t.telTitle}
                                    placeholder="0612345678"
                                    required
                                    style={inputStyle(errors.telephone)}
                                />
                            </Field>

                            <Field label={t.email} error={errors.email}>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    required
                                    style={inputStyle(errors.email)}
                                />
                            </Field>

                            <Field label={t.password} error={errors.password}>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    minLength="8"
                                    pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}"
                                    title={t.passwordTitle}
                                    required
                                    style={inputStyle(errors.password)}
                                />
                            </Field>

                            <Field label={t.confirmation} error={errors.password_confirmation}>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    minLength="8"
                                    required
                                    style={inputStyle(errors.password_confirmation)}
                                />
                            </Field>
                        </div>

                        {/* Role selector */}
                        <Field label={t.typeCompte} error={errors.role}>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['patient', 'responsable'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setData('role', role)}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 10,
                                            border: `1.5px solid ${data.role === role ? C.blue : C.border}`,
                                            backgroundColor: data.role === role ? C.blueSoft : 'rgba(255,255,255,0.04)',
                                            color: data.role === role ? C.blue : C.textMuted,
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {role === 'patient' ? t.patient : t.responsable}
                                    </button>
                                ))}
                            </div>
                        </Field>
                        {data.role === 'patient' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                                <Field label={t.dateNaissance} error={errors.date_naissance}>
                                    <input
                                        type="date"
                                        value={data.date_naissance}
                                        onChange={(e) => setData('date_naissance', e.target.value)}
                                        required
                                        style={inputStyle(errors.date_naissance)}
                                    />
                                </Field>

                                <Field label={t.lien} error={errors.lien}>
                                    <select
                                        value={data.lien}
                                        onChange={(e) => setData('lien', e.target.value)}
                                        required
                                        style={inputStyle(errors.lien)}
                                    >
                                        {getLienOptions().map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label={t.responsableLabel} error={errors.responsable_id}>
                                    <select
                                        value={data.responsable_id}
                                        onChange={(e) => setData('responsable_id', e.target.value)}
                                        required
                                        style={inputStyle(errors.responsable_id)}
                                    >
                                        <option value="">{t.choisirResponsable}</option>
                                        {responsables.map((resp) => (
                                            <option key={resp.id} value={resp.id}>
                                                {resp.nom} {resp.prenom}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label={t.adresse} error={errors.adresse}>
                                        <input
                                            value={data.adresse}
                                            onChange={(e) => setData('adresse', e.target.value)}
                                            maxLength="255"
                                            required
                                            style={inputStyle(errors.adresse)}
                                        />
                                    </Field>
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: 14,
                                marginTop: 6,
                                background: 'linear-gradient(135deg,#818CF8,#6366F1)',
                                color: C.white,
                                border: 'none',
                                borderRadius: 10,
                                fontSize: 15,
                                fontWeight: 800,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.7 : 1,
                                transition: 'all 0.2s',
                            }}
                        >
                            {processing ? t.creating : t.submit}
                        </button>

                        <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 13, margin: '20px 0 0' }}>
                            {t.alreadyAccount}{' '}
                            <Link href={route('login')} style={{ color: C.blue, fontWeight: 800, textDecoration: 'none' }}>
                                {t.login}
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}