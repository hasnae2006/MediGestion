import { usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const text = {
    fr: {
        title: 'Tableau de bord',
        subtitle: 'Vue globale des patients, ordonnances et alertes.',
        patients: 'Patients',
        ordonnances: 'Ordonnances actives',
        alertes: 'Alertes à traiter',
        stock: 'Unités en stock',
        recent: 'Ordonnances récentes',
        patient: 'Patient',
        medecin: 'Médecin',
        date: 'Date',
        medicaments: 'Médicaments',
        emptyOrdonnances: 'Aucune ordonnance active.',
        adherence: 'Adhérence sur 30 jours',
        taken: 'Prises confirmées',
        missedToday: "Prises manquées aujourd'hui",
        noMissed: 'Aucune prise manquée.',
        lowStock: 'Stock faible',
        noLowStock: 'Tous les stocks sont corrects.',
        qty: 'Stock',
    },
    en: {
        title: 'Dashboard',
        subtitle: 'Overview of patients, prescriptions and alerts.',
        patients: 'Patients',
        ordonnances: 'Active prescriptions',
        alertes: 'Alerts to handle',
        stock: 'Units in stock',
        recent: 'Recent prescriptions',
        patient: 'Patient',
        medecin: 'Doctor',
        date: 'Date',
        medicaments: 'Medicines',
        emptyOrdonnances: 'No active prescription.',
        adherence: '30-day adherence',
        taken: 'Confirmed doses',
        missedToday: 'Missed doses today',
        noMissed: 'No missed dose.',
        lowStock: 'Low stock',
        noLowStock: 'All stocks are fine.',
        qty: 'Stock',
    },
    ar: {
        title: 'لوحة التحكم',
        subtitle: 'نظرة عامة على المرضى والوصفات والتنبيهات.',
        patients: 'المرضى',
        ordonnances: 'الوصفات النشطة',
        alertes: 'تنبيهات للمعالجة',
        stock: 'وحدات في المخزون',
        recent: 'الوصفات الأخيرة',
        patient: 'المريض',
        medecin: 'الطبيب',
        date: 'التاريخ',
        medicaments: 'الأدوية',
        emptyOrdonnances: 'لا توجد وصفات نشطة.',
        adherence: 'الالتزام خلال 30 يوما',
        taken: 'جرعات مؤكدة',
        missedToday: 'جرعات فائتة اليوم',
        noMissed: 'لا توجد جرعات فائتة.',
        lowStock: 'مخزون منخفض',
        noLowStock: 'كل المخزون جيد.',
        qty: 'المخزون',
    },
};

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

function StatCard({ value, label, tone }) {
    return (
        <div style={{ ...cardStyle, padding: 18 }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: tone, marginBottom: 16 }} />
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>{value}</div>
            <div style={{ color: 'var(--muted)', fontWeight: 800, marginTop: 4 }}>{label}</div>
        </div>
    );
}

function ProgressCircle({ value, label }) {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="112" height="112" viewBox="0 0 112 112" aria-label={`${value}%`}>
                <circle cx="56" cy="56" r={radius} fill="none" stroke="#e6eef5" strokeWidth="12" />
                <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 56 56)"
                />
                <text x="56" y="61" textAnchor="middle" fontSize="20" fontWeight="900" fill="var(--text)">
                    {value}%
                </text>
            </svg>
            <div>
                <div style={{ color: 'var(--text)', fontWeight: 900 }}>{label}</div>
                <div style={{ color: 'var(--muted)', marginTop: 4 }}>{value}%</div>
            </div>
        </div>
    );
}

function EmptyState({ children }) {
    return (
        <div style={{ padding: 22, textAlign: 'center', color: 'var(--muted)', background: 'var(--panel-soft)', borderRadius: 8 }}>
            {children}
        </div>
    );
}

export default function ResponsableDashboard() {
    const { stats = {}, adherence = 0, alertes = [], stockFaible = [], ordonnances = [] } = usePage().props;
    const lang = useLang();
    const t = text[lang] || text.fr;

    const dateLocale = lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR';
    const today = new Date().toLocaleDateString(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <AppLayout>
            <header style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>{t.title}</h1>
                <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>
                    {t.subtitle} · {today}
                </p>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 18 }}>
                <StatCard value={stats.patients ?? 0} label={t.patients} tone="var(--blue)" />
                <StatCard value={stats.ordonnances_actives ?? 0} label={t.ordonnances} tone="var(--teal)" />
                <StatCard value={stats.alertes_non_traitees ?? 0} label={t.alertes} tone="var(--red)" />
                <StatCard value={stats.stock_total ?? 0} label={t.stock} tone="var(--amber)" />
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 18, marginBottom: 18 }}>
                <div style={{ ...cardStyle, padding: 20, overflowX: 'auto' }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{t.recent}</h2>
                    {ordonnances.length === 0 ? (
                        <EmptyState>{t.emptyOrdonnances}</EmptyState>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                            <thead>
                                <tr>
                                    {[t.patient, t.medecin, t.date, t.medicaments].map((heading) => (
                                        <th key={heading} style={{ textAlign: 'start', padding: '10px 12px', color: 'var(--muted)', fontSize: 12 }}>
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ordonnances.map((ordonnance, index) => (
                                    <tr key={`${ordonnance.patient}-${ordonnance.date}-${index}`} style={{ borderTop: '1px solid var(--line)' }}>
                                        <td style={{ padding: '12px', fontWeight: 800 }}>{ordonnance.patient}</td>
                                        <td style={{ padding: '12px', color: 'var(--muted)' }}>{ordonnance.medecin}</td>
                                        <td style={{ padding: '12px' }}>{ordonnance.date}</td>
                                        <td style={{ padding: '12px' }}>{ordonnance.medicaments}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ ...cardStyle, padding: 20 }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{t.adherence}</h2>
                    <ProgressCircle value={adherence} label={t.taken} />
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
                <div style={{ ...cardStyle, padding: 20 }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{t.missedToday}</h2>
                    {alertes.length === 0 ? (
                        <EmptyState>{t.noMissed}</EmptyState>
                    ) : (
                        <div style={{ display: 'grid', gap: 10 }}>
                            {alertes.map((alerte, index) => (
                                <div key={`${alerte.patient}-${alerte.heure}-${index}`} style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,.08)', color: 'var(--text)' }}>
                                    <strong>{alerte.patient}</strong>
                                    <div style={{ color: 'var(--muted)', marginTop: 3 }}>
                                        {alerte.medicament} · {alerte.heure}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ ...cardStyle, padding: 20 }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>{t.lowStock}</h2>
                    {stockFaible.length === 0 ? (
                        <EmptyState>{t.noLowStock}</EmptyState>
                    ) : (
                        <div style={{ display: 'grid', gap: 10 }}>
                            {stockFaible.map((stock) => (
                                <div key={stock.nom_commercial} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: 12, borderRadius: 8, background: 'rgba(245,158,11,.1)' }}>
                                    <strong>{stock.nom_commercial}</strong>
                                    <span style={{ color: 'var(--amber)', fontWeight: 900 }}>
                                        {t.qty}: {stock.quantite_stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
