import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const translations = {
    fr: {
        pageTitle: 'Inscription',
        heading: 'Créer un compte',
        subheading: 'Renseignez les informations nécessaires pour démarrer.',
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
        lien: 'Lien avec le responsable',
        responsableLabel: 'Responsable',
        adresse: 'Adresse',
        choisirResponsable: 'Choisir un responsable',
        creating: 'Création...',
        submit: 'Créer le compte',
        alreadyAccount: 'Déjà un compte ?',
        login: 'Connexion',
        liens: ['fils', 'fille', 'époux', 'épouse', 'père', 'mère', 'frère', 'sœur', 'infirmier', 'autre'],
    },
    en: {
        pageTitle: 'Register',
        heading: 'Create an account',
        subheading: 'Fill in the required information to get started.',
        nom: 'Last name',
        prenom: 'First name',
        telephone: 'Phone',
        email: 'Email',
        password: 'Password',
        confirmation: 'Confirmation',
        typeCompte: 'Account type',
        patient: 'Patient',
        responsable: 'Manager',
        dateNaissance: 'Date of birth',
        lien: 'Relationship',
        responsableLabel: 'Manager',
        adresse: 'Address',
        choisirResponsable: 'Choose a manager',
        creating: 'Creating...',
        submit: 'Create account',
        alreadyAccount: 'Already have an account?',
        login: 'Sign in',
        liens: ['son', 'daughter', 'husband', 'wife', 'father', 'mother', 'brother', 'sister', 'nurse', 'other'],
    },
    ar: {
        pageTitle: 'التسجيل',
        heading: 'إنشاء حساب',
        subheading: 'املأ المعلومات اللازمة للبدء.',
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
        choisirResponsable: 'اختر مسؤولا',
        creating: 'جار الإنشاء...',
        submit: 'إنشاء الحساب',
        alreadyAccount: 'لديك حساب؟',
        login: 'تسجيل الدخول',
        liens: ['ابن', 'ابنة', 'زوج', 'زوجة', 'أب', 'أم', 'أخ', 'أخت', 'ممرض', 'آخر'],
    },
};

function LangSelector({ lang, setLang }) {
    return (
        <div className="lang-switch" style={{ justifyContent: 'flex-end', padding: 0, border: 0, marginBottom: 12 }}>
            {['fr', 'en', 'ar'].map((code) => (
                <button
                    key={code}
                    type="button"
                    className={lang === code ? 'is-active' : ''}
                    onClick={() => setLang(code)}
                    style={{ flex: '0 0 auto', minWidth: 48 }}
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

function Field({ label, error, className = '', children }) {
    return (
        <div className={`field ${className}`}>
            <label>{label}</label>
            {children}
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default function Register({ responsables = [] }) {
    const [lang, setLangState] = useState(() => {
        try {
            return localStorage.getItem('lang') || 'fr';
        } catch {
            return 'fr';
        }
    });
    const t = translations[lang] || translations.fr;

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

    const setLang = (code) => {
        try {
            localStorage.setItem('lang', code);
            window.dispatchEvent(new CustomEvent('app:lang', { detail: code }));
        } catch {}
        setLangState(code);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const lienOptions = t.liens.map((label, index) => ({
        value: translations.fr.liens[index],
        label,
    }));

    return (
        <div className="auth-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Head title={t.pageTitle} />
            <div className="auth-wrap" style={{ width: 'min(860px, 100%)' }}>
                <LangSelector lang={lang} setLang={setLang} />

                <div className="auth-card" style={{ gridTemplateColumns: '1fr' }}>
                    <section className="auth-form">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 18, marginBottom: 24 }}>
                            <div>
                                <h1 className="auth-title">{t.heading}</h1>
                                <p className="auth-subtitle" style={{ marginBottom: 0 }}>{t.subheading}</p>
                            </div>
                            <div className="brand-mark">MG</div>
                        </div>

                        <form onSubmit={submit}>
                            <div className="form-grid">
                                <Field label={t.nom} error={errors.nom}>
                                    <input
                                        value={data.nom}
                                        onChange={(event) => setData('nom', event.target.value)}
                                        pattern="[A-Za-zÀ-ÿ\u0600-\u06FF\s'-]{2,100}"
                                        required
                                    />
                                </Field>

                                <Field label={t.prenom} error={errors.prenom}>
                                    <input
                                        value={data.prenom}
                                        onChange={(event) => setData('prenom', event.target.value)}
                                        pattern="[A-Za-zÀ-ÿ\u0600-\u06FF\s'-]{2,100}"
                                        required
                                    />
                                </Field>

                                <Field label={t.telephone} error={errors.telephone}>
                                    <input
                                        value={data.telephone}
                                        onChange={(event) => setData('telephone', event.target.value)}
                                        pattern="(\+212|0)[5-7][0-9]{8}"
                                        placeholder="0612345678"
                                        required
                                    />
                                </Field>

                                <Field label={t.email} error={errors.email}>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        autoComplete="username"
                                        required
                                    />
                                </Field>

                                <Field label={t.password} error={errors.password}>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        autoComplete="new-password"
                                        minLength="8"
                                        pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,}"
                                        required
                                    />
                                </Field>

                                <Field label={t.confirmation} error={errors.password_confirmation}>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(event) => setData('password_confirmation', event.target.value)}
                                        autoComplete="new-password"
                                        minLength="8"
                                        required
                                    />
                                </Field>

                                <Field label={t.typeCompte} error={errors.role} className="span-full">
                                    <div className="segmented">
                                        {['patient', 'responsable'].map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                className={data.role === role ? 'is-active' : ''}
                                                onClick={() => setData('role', role)}
                                            >
                                                {role === 'patient' ? t.patient : t.responsable}
                                            </button>
                                        ))}
                                    </div>
                                </Field>

                                {data.role === 'patient' && (
                                    <>
                                        <Field label={t.dateNaissance} error={errors.date_naissance}>
                                            <input
                                                type="date"
                                                value={data.date_naissance}
                                                onChange={(event) => setData('date_naissance', event.target.value)}
                                                required
                                            />
                                        </Field>

                                        <Field label={t.lien} error={errors.lien}>
                                            <select
                                                value={data.lien}
                                                onChange={(event) => setData('lien', event.target.value)}
                                                required
                                            >
                                                {lienOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field label={t.responsableLabel} error={errors.responsable_id}>
                                            <select
                                                value={data.responsable_id}
                                                onChange={(event) => setData('responsable_id', event.target.value)}
                                                required
                                            >
                                                <option value="">{t.choisirResponsable}</option>
                                                {responsables.map((responsable) => (
                                                    <option key={responsable.id} value={responsable.id}>
                                                        {responsable.nom} {responsable.prenom}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>

                                        <Field label={t.adresse} error={errors.adresse}>
                                            <input
                                                value={data.adresse}
                                                onChange={(event) => setData('adresse', event.target.value)}
                                                maxLength="255"
                                                required
                                            />
                                        </Field>
                                    </>
                                )}
                            </div>

                            <button type="submit" className="btn-primary" disabled={processing}>
                                {processing ? t.creating : t.submit}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', color: 'var(--muted)', margin: '20px 0 0' }}>
                            {t.alreadyAccount}{' '}
                            <Link href={route('login')} style={{ color: 'var(--blue)', fontWeight: 900, textDecoration: 'none' }}>
                                {t.login}
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
