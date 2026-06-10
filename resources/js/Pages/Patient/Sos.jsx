import { useForm, usePage } from '@inertiajs/react';
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

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const translations = {
    fr: {
        page: { title: 'Alerte SOS', subtitle: 'Cette alerte sera immédiatement transmise à votre responsable.' },
        doctor: { label: 'Médecin traitant', call: 'Appeler mon médecin', noDoctor: 'Aucun médecin assigné' },
        emergency: { title: 'Alerte d\'urgence activée', sub: 'Votre responsable sera notifié immédiatement à l\'envoi.' },
        form: {
            label: 'Message d\'urgence',
            placeholder: 'Décrivez votre situation d\'urgence...',
            hint: 'Minimum 5 caractères requis',
            send: 'Envoyer l\'alerte SOS',
            sending: 'Envoi en cours...',
        },
        success: {
            title: 'Alerte envoyée avec succès',
            message: 'Votre responsable a été notifié immédiatement.',
            button: 'Envoyer une autre alerte',
        },
        errors: {
            noResponsable: 'Aucun responsable actif trouvé. Veuillez contacter votre administrateur.',
        },
    },
    en: {
        page: { title: 'SOS Alert', subtitle: 'This alert will be immediately sent to your supervisor.' },
        doctor: { label: 'Attending doctor', call: 'Call my doctor', noDoctor: 'No doctor assigned' },
        emergency: { title: 'Emergency alert activated', sub: 'Your supervisor will be notified immediately upon sending.' },
        form: {
            label: 'Emergency message',
            placeholder: 'Describe your emergency situation...',
            hint: 'Minimum 5 characters required',
            send: 'Send SOS Alert',
            sending: 'Sending...',
        },
        success: {
            title: 'Alert sent successfully',
            message: 'Your supervisor has been notified immediately.',
            button: 'Send another alert',
        },
        errors: {
            noResponsable: 'No active supervisor found. Please contact your administrator.',
        },
    },
    ar: {
        page: { title: 'تنبيه SOS', subtitle: 'سيتم إرسال هذا التنبيه فوراً إلى مسؤولك.' },
        doctor: { label: 'الطبيب المعالج', call: 'الاتصال بطبيبي', noDoctor: 'لا يوجد طبيب معين' },
        emergency: { title: 'تم تفعيل تنبيه الطوارئ', sub: 'سيتم إخطار مسؤولك فوراً عند الإرسال.' },
        form: {
            label: 'رسالة الطوارئ',
            placeholder: 'صف حالة الطوارئ الخاصة بك...',
            hint: '٥ أحرف على الأقل مطلوبة',
            send: 'إرسال تنبيه SOS',
            sending: 'جاري الإرسال...',
        },
        success: {
            title: 'تم إرسال التنبيه بنجاح',
            message: 'تم إخطار مسؤولك فوراً.',
            button: 'إرسال تنبيه آخر',
        },
        errors: {
            noResponsable: 'لا يوجد مسؤول نشط. يرجى الاتصال بالمسؤول.',
        },
    },
};

const EmergencyBanner = ({ t }) => (
    <div style={{
        background: 'rgba(239,68,68,.08)',
        border: '1px solid var(--line)',
        borderLeft: '3px solid var(--red)',
        borderRadius: 0,
        padding: '14px 18px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        marginBottom: 16,
    }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div>
            <div style={{ fontWeight: 900, fontSize: 14, color: 'var(--red)' }}>{t.emergency.title}</div>
            <div style={{ fontSize: 12, color: 'var(--red)', opacity: 0.75, marginTop: 2 }}>{t.emergency.sub}</div>
        </div>
    </div>
);

const DoctorCard = ({ medecin, t }) => {
    if (!medecin) return null;
    return (
        <div style={{ ...cardStyle, padding: 18, marginBottom: 16 }}>
            <div style={lbl}>{t.doctor.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid var(--line)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 7c0 4.418-3.582 8-8 8S4 11.418 4 7a8 8 0 0 1 16 0z"/>
                            <path d="M12 15v7"/><path d="M9 19h6"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 14, color: 'var(--text)' }}>
                            Dr. {medecin.nom} {medecin.prenom}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{medecin.specialite}</div>
                        <div style={{ fontSize: 12, color: 'var(--blue)', marginTop: 2, fontWeight: 800 }}>{medecin.telephone}</div>
                    </div>
                </div>
                <a
                    href={`tel:${medecin.telephone}`}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 18px',
                        background: 'rgba(239,68,68,.08)',
                        border: '1px solid var(--line)',
                        borderRadius: 8,
                        color: 'var(--red)', fontSize: 13, fontWeight: 800,
                        textDecoration: 'none', whiteSpace: 'nowrap',
                        cursor: 'pointer',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l1.06-.86a2 2 0 0 1 2.06-.44 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {t.doctor.call}
                </a>
            </div>
        </div>
    );
};

const ErrorBanner = ({ message, t }) => {
    if (!message) return null;
    return (
        <div style={{
            ...cardStyle,
            background: 'rgba(239,68,68,.08)',
            borderLeft: '3px solid var(--red)',
            borderRadius: 0,
            padding: '14px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            marginBottom: 16,
        }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--red)' }}>{t.errors.noResponsable}</div>
                {message !== true && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{message}</div>
                )}
            </div>
        </div>
    );
};

const SuccessState = ({ onReset, t }) => (
    <div style={{
        ...cardStyle,
        padding: 36, textAlign: 'center',
        background: 'rgba(20,184,166,0.08)',
        borderLeft: '3px solid var(--teal)',
    }}>
        <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
        }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--teal)', margin: '0 0 8px' }}>{t.success.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 20px' }}>{t.success.message}</p>
        <button
            onClick={onReset}
            style={{
                padding: '10px 22px',
                background: 'rgba(20,184,166,0.1)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                color: 'var(--teal)', fontSize: 13, fontWeight: 800,
                cursor: 'pointer',
            }}
        >
            {t.success.button}
        </button>
    </div>
);

const SosForm = ({ message, onMessageChange, onSubmit, isProcessing, t }) => {
    const isEmpty = !message.trim() || message.trim().length < 5;
    return (
        <div style={{ ...cardStyle, padding: 20 }}>
            <label style={lbl}>{t.form.label}</label>
            <textarea
                value={message}
                onChange={onMessageChange}
                placeholder={t.form.placeholder}
                required
                style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 14px',
                    background: 'var(--panel-soft)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    fontSize: 14, color: 'var(--text)',
                    minHeight: 120, resize: 'vertical',
                    fontFamily: 'inherit', outline: 'none',
                    colorScheme: 'dark',
                    transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--red)'}
                onBlur={e => e.target.style.borderColor = 'var(--line)'}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: isEmpty ? 'var(--muted)' : 'var(--teal)' }}>
                    {isEmpty ? t.form.hint : `${message.trim().length} caractères`}
                </span>
                <button
                    onClick={onSubmit}
                    disabled={isProcessing || isEmpty}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px',
                        background: 'var(--red)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff', fontSize: 13, fontWeight: 800,
                        cursor: (isProcessing || isEmpty) ? 'not-allowed' : 'pointer',
                        opacity: (isProcessing || isEmpty) ? 0.4 : 1,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    {isProcessing ? t.form.sending : t.form.send}
                </button>
            </div>
        </div>
    );
};

export default function Sos() {
    const { medecin = null, errors: serverErrors = {}, flash } = usePage().props;
    const lang = useLang();
    const t    = translations[lang] || translations.fr;
    const isRtl = lang === 'ar';

    const { data, setData, post, processing, wasSuccessful, reset } = useForm({ message: '' });

    const hasResponsableError = serverErrors?.error || serverErrors?.message;
    const showSuccess = (wasSuccessful || flash?.success) && !hasResponsableError;
    const showForm    = !showSuccess && !hasResponsableError;

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        post('/patient/sos', {
            onSuccess: () => reset(),
            onError:   (err) => console.error('Erreur SOS:', err),
        });
    };

    const handleReset = () => {
        reset();
        if (hasResponsableError) window.location.reload();
    };

    return (
        <AppLayout>
            <div style={pageStyle}>
            <div style={{ direction: isRtl ? 'rtl' : 'ltr', maxWidth: 660, margin: '0 auto' }}>
                <header style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: 'var(--red)',
                            boxShadow: '0 0 0 3px rgba(239,68,68,.15)',
                            animation: 'sosPulse 1.6s ease-in-out infinite',
                        }} />
                        <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', margin: 0 }}>
                            {t.page.title}
                        </h1>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0, paddingLeft: 18 }}>
                        {t.page.subtitle}
                    </p>
                </header>

                <style>{`
                    @keyframes sosPulse {
                        0%, 100% { opacity: 1; }
                        50%       { opacity: 0.25; }
                    }
                `}</style>

                <EmergencyBanner t={t} />
                <DoctorCard medecin={medecin} t={t} />
                <ErrorBanner message={hasResponsableError} t={t} />

                {showSuccess && <SuccessState onReset={handleReset} t={t} />}
                {showForm && (
                    <SosForm
                        message={data.message}
                        onMessageChange={(e) => setData('message', e.target.value)}
                        onSubmit={handleSubmit}
                        isProcessing={processing}
                        t={t}
                    />
                )}
            </div>
            </div>
        </AppLayout>
    );
}
