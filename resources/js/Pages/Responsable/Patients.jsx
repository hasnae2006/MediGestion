import { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';
const C = {
    bgCard:  'rgba(255,255,255,0.07)',
    blue:    '#818CF8', blueSoft: 'rgba(129,140,248,0.15)',
    green:   '#34D399', greenSoft: 'rgba(52,211,153,0.15)',
    red:     '#F87171', redSoft: 'rgba(248,113,113,0.15)',
    yellow:  '#FBBF24', yellowSoft: 'rgba(251,191,36,0.15)',
    text:    '#F1F5F9', textMuted: '#94A3B8', textHint: '#475569',
    border:  'rgba(255,255,255,0.10)', borderLight: 'rgba(255,255,255,0.05)',
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

const inp = () => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: 14, boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: C.text, outline: 'none',
});

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: C.textMuted, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const th = {
    textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700,
    color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: `1px solid ${C.border}`,
};

const td = {
    padding: '12px 16px', fontSize: 14,
    borderBottom: `1px solid ${C.borderLight}`,
    verticalAlign: 'middle', color: C.text,
};
const text = {
    fr: {
        titre: 'Gestion des patients', nb: 'patient(s) enregistré(s)',
        ajouter: '+ Ajouter patient', fermer: '✕ Fermer', nouveau: 'Nouveau patient',
        cols: ['Nom','Email','Téléphone','Lien','État','Médecin','Adhérence','Actions'],
        nom: 'Nom', prenom: 'Prénom', email: 'Email', telephone: 'Téléphone',
        password: 'Mot de passe', password_confirm: 'Confirmer mot de passe',
        lien: 'Lien avec le patient', date_naissance: 'Date de naissance',
        medecin: 'Médecin assigné', aucun_medecin: '-- Aucun médecin --',
        enregistrer: 'Enregistrer', annuler: 'Annuler', mettre_a_jour: '💾 Mettre à jour',
        recherche: '🔍 Rechercher par nom ou email...',
        aucun: 'Aucun patient trouvé.', non_assigne: 'Non assigné',
        confirmer_titre: 'Confirmer la suppression',
        confirmer_msg: 'Voulez-vous retirer', confirmer_msg2: 'de votre liste ?',
        retirer: 'Retirer', etat_options: ['actif', 'inactif', 'gueri'],
    },
    en: {
        titre: 'Patient Management', nb: 'patient(s) registered',
        ajouter: '+ Add patient', fermer: '✕ Close', nouveau: 'New patient',
        cols: ['Name','Email','Phone','Link','Status','Doctor','Adherence','Actions'],
        nom: 'Last name', prenom: 'First name', email: 'Email', telephone: 'Phone',
        password: 'Password', password_confirm: 'Confirm password',
        lien: 'Link with patient', date_naissance: 'Date of birth',
        medecin: 'Assigned doctor', aucun_medecin: '-- No doctor --',
        enregistrer: 'Save', annuler: 'Cancel', mettre_a_jour: '💾 Update',
        recherche: '🔍 Search by name or email...',
        aucun: 'No patients found.', non_assigne: 'Not assigned',
        confirmer_titre: 'Confirm deletion',
        confirmer_msg: 'Do you want to remove', confirmer_msg2: 'from your list?',
        retirer: 'Remove', etat_options: ['actif', 'inactif', 'gueri'],
    },
    ar: {
        titre: 'إدارة المرضى', nb: 'مريض مسجل',
        ajouter: '+ إضافة مريض', fermer: '✕ إغلاق', nouveau: 'مريض جديد',
        cols: ['الاسم','البريد','الهاتف','الصلة','الحالة','الطبيب','الالتزام','الإجراءات'],
        nom: 'اللقب', prenom: 'الاسم', email: 'البريد الإلكتروني', telephone: 'الهاتف',
        password: 'كلمة المرور', password_confirm: 'تأكيد كلمة المرور',
        lien: 'الصلة بالمريض', date_naissance: 'تاريخ الميلاد',
        medecin: 'الطبيب المعين', aucun_medecin: '-- لا يوجد طبيب --',
        enregistrer: 'حفظ', annuler: 'إلغاء', mettre_a_jour: '💾 تحديث',
        recherche: '🔍 البحث بالاسم أو البريد...',
        aucun: 'لا يوجد مرضى.', non_assigne: 'غير معين',
        confirmer_titre: 'تأكيد الحذف',
        confirmer_msg: 'هل تريد إزالة', confirmer_msg2: 'من قائمتك؟',
        retirer: 'إزالة', etat_options: ['actif', 'inactif', 'gueri'],
    },
};

const LIENS = ['fils', 'fille', 'epoux', 'epouse', 'pere', 'mere', 'frere', 'soeur', 'infirmier', 'autre'];
export default function Patients() {
    const { patients = [], medecins = [] } = usePage().props;
    const lang = useLang();
    const t = text[lang] || text.fr;

    const [search, setSearch]           = useState('');
    const [showAdd, setShowAdd]         = useState(false);
    const [editPatient, setEditPatient] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const addForm  = useForm({ nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '', lien: 'autre', date_naissance: '', medecin_id: '' });
    const editForm = useForm({ nom: '', prenom: '', email: '', telephone: '', lien: 'autre', etat: 'actif', date_naissance: '', medecin_id: '' });

    const openEdit = (p) => {
        setEditPatient(p);
        setShowAdd(false);
        editForm.setData({ nom: p.nom, prenom: p.prenom, email: p.email, telephone: p.telephone, lien: p.lien, etat: p.etat, date_naissance: p.date_naissance || '', medecin_id: p.medecin_id || '' });
        window.scrollTo(0, 0);
    };

    const handleAdd    = () => addForm.post('/responsable/patients', { onSuccess: () => { addForm.reset(); setShowAdd(false); } });
    const handleEdit   = () => editForm.put(`/responsable/patients/${editPatient.id}`, { onSuccess: () => setEditPatient(null) });
    const handleDelete = () => { router.delete(`/responsable/patients/${confirmDelete.id}`); setConfirmDelete(null); };

    const filtered = patients.filter(p =>
        `${p.nom} ${p.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout>
            {confirmDelete && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={glass({ padding: 32, maxWidth: 400, width: '90%', textAlign: 'center' })}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', color: C.text }}>{t.confirmer_titre}</h3>
                        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>
                            {t.confirmer_msg} <strong style={{ color: C.text }}>{confirmDelete.prenom} {confirmDelete.nom}</strong> {t.confirmer_msg2}
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                style={{ padding: '8px 20px', border: `1px solid ${C.border}`, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted, cursor: 'pointer', fontWeight: 600 }}
                            >{t.annuler}</button>
                            <button
                                onClick={handleDelete}
                                style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#F87171,#DC2626)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
                            >{t.retirer}</button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>{t.titre}</h1>
                    <p style={{ fontSize: 14, color: C.textMuted, margin: '4px 0 0' }}>{patients.length} {t.nb}</p>
                </div>
                <button
                    onClick={() => { setShowAdd(!showAdd); setEditPatient(null); }}
                    style={{ background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 15px rgba(129,140,248,0.35)' }}
                >
                    {showAdd ? t.fermer : t.ajouter}
                </button>
            </div>
            {showAdd && (
                <div style={glass({ padding: 24, marginBottom: 16, border: '1px solid rgba(52,211,153,0.3)' })}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>{t.nouveau}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[[t.nom,'nom'],[t.prenom,'prenom'],[t.email,'email'],[t.telephone,'telephone']].map(([l,k]) => (
                            <div key={k}>
                                <label style={lbl}>{l}</label>
                                <input style={inp()} value={addForm.data[k]} onChange={e => addForm.setData(k, e.target.value)} />
                            </div>
                        ))}
                        <div>
                            <label style={lbl}>{t.password}</label>
                            <input type="password" style={inp()} value={addForm.data.password} onChange={e => addForm.setData('password', e.target.value)} />
                        </div>
                        <div>
                            <label style={lbl}>{t.password_confirm}</label>
                            <input type="password" style={inp()} value={addForm.data.password_confirmation} onChange={e => addForm.setData('password_confirmation', e.target.value)} />
                        </div>
                        <div>
                            <label style={lbl}>{t.lien}</label>
                            <select style={inp()} value={addForm.data.lien} onChange={e => addForm.setData('lien', e.target.value)}>
                                {LIENS.map(l => <option key={l} style={{ backgroundColor: '#1A1F4E' }}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>{t.date_naissance}</label>
                            <input type="date" style={inp()} value={addForm.data.date_naissance} onChange={e => addForm.setData('date_naissance', e.target.value)} />
                        </div>
                        <div>
                            <label style={lbl}>{t.medecin}</label>
                            <select style={inp()} value={addForm.data.medecin_id} onChange={e => addForm.setData('medecin_id', e.target.value)}>
                                <option value="" style={{ backgroundColor: '#1A1F4E' }}>{t.aucun_medecin}</option>
                                {medecins.map(m => <option key={m.id} value={m.id} style={{ backgroundColor: '#1A1F4E' }}>Dr. {m.nom} {m.prenom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={handleAdd} style={{ background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>{t.enregistrer}</button>
                        <button onClick={() => setShowAdd(false)} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>{t.annuler}</button>
                    </div>
                </div>
            )}
            {editPatient && (
                <div style={glass({ padding: 24, marginBottom: 16, border: '1px solid rgba(251,191,36,0.3)' })}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.yellow }}>✏️ — {editPatient.prenom} {editPatient.nom}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[[t.nom,'nom'],[t.prenom,'prenom'],[t.email,'email'],[t.telephone,'telephone']].map(([l,k]) => (
                            <div key={k}>
                                <label style={lbl}>{l}</label>
                                <input style={inp()} value={editForm.data[k]} onChange={e => editForm.setData(k, e.target.value)} />
                            </div>
                        ))}
                        <div>
                            <label style={lbl}>{t.lien}</label>
                            <select style={inp()} value={editForm.data.lien} onChange={e => editForm.setData('lien', e.target.value)}>
                                {LIENS.map(l => <option key={l} style={{ backgroundColor: '#1A1F4E' }}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>État</label>
                            <select style={inp()} value={editForm.data.etat} onChange={e => editForm.setData('etat', e.target.value)}>
                                {t.etat_options.map(e => <option key={e} style={{ backgroundColor: '#1A1F4E' }}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>{t.medecin}</label>
                            <select style={inp()} value={editForm.data.medecin_id} onChange={e => editForm.setData('medecin_id', e.target.value)}>
                                <option value="" style={{ backgroundColor: '#1A1F4E' }}>{t.aucun_medecin}</option>
                                {medecins.map(m => <option key={m.id} value={m.id} style={{ backgroundColor: '#1A1F4E' }}>Dr. {m.nom} {m.prenom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={handleEdit} style={{ background: 'linear-gradient(135deg,#FBBF24,#D97706)', color: '#0F1535', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>{t.mettre_a_jour}</button>
                        <button onClick={() => setEditPatient(null)} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>{t.annuler}</button>
                    </div>
                </div>
            )}
            <div style={glass({ padding: '12px 16px', marginBottom: 12 })}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...inp(), marginBottom: 0 }}
                    placeholder={t.recherche}
                />
            </div>
            <div style={glass({ overflow: 'hidden', padding: 0 })}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            {t.cols.map(h => <th key={h} style={th}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr
                                key={p.id}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.035)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                style={{ transition: 'background 0.15s' }}
                            >
                                <td style={td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(167,139,250,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                                        <span style={{ fontWeight: 600 }}>{p.prenom} {p.nom}</span>
                                    </div>
                                </td>
                                <td style={{ ...td, color: C.textMuted }}>{p.email}</td>
                                <td style={td}>{p.telephone}</td>
                                <td style={td}>
                                    <span style={{ backgroundColor: C.blueSoft, color: C.blue, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.lien}</span>
                                </td>
                                <td style={td}>
                                    <span style={{ backgroundColor: p.etat === 'actif' ? C.greenSoft : C.redSoft, color: p.etat === 'actif' ? C.green : C.red, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.etat}</span>
                                </td>
                                <td style={td}>
                                    {p.medecin
                                        ? <div>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>Dr. {p.medecin.nom} {p.medecin.prenom}</div>
                                            <div style={{ color: C.textHint, fontSize: 11 }}>{p.medecin.specialite}</div>
                                          </div>
                                        : <span style={{ color: C.textHint, fontSize: 12 }}>{t.non_assigne}</span>
                                    }
                                </td>
                                <td style={td}>
                                    <span style={{ fontWeight: 700, color: p.adherence >= 80 ? C.green : p.adherence >= 60 ? C.yellow : C.red }}>
                                        {p.adherence}%
                                    </span>
                                </td>
                                <td style={td}>
                                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 6, fontSize: 16 }}>✏️</button>
                                    <button onClick={() => setConfirmDelete(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <p style={{ textAlign: 'center', color: C.textMuted, padding: 32 }}>{t.aucun}</p>
                )}
            </div>
        </AppLayout>
    );
}
