import { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const inp = () => ({
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
    background: 'var(--panel-soft)',
    color: 'var(--text)', outline: 'none',
    colorScheme: 'dark',
});

const lbl = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const th = {
    textAlign: 'left', padding: '10px 12px', fontSize: 12,
    color: 'var(--muted)', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const td = {
    padding: '12px', fontSize: 14,
    borderTop: '1px solid var(--line)',
    verticalAlign: 'middle', color: 'var(--text)',
};

const onFocus = e => { e.target.style.borderColor = 'var(--blue)'; };
const onBlur  = e => { e.target.style.borderColor = 'var(--line)'; };

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

    const [search, setSearch]               = useState('');
    const [showAdd, setShowAdd]             = useState(false);
    const [editPatient, setEditPatient]     = useState(null);
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
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ ...cardStyle, padding: 32, maxWidth: 400, width: '90%', textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                        <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px', color: 'var(--text)' }}>{t.confirmer_titre}</h3>
                        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
                            {t.confirmer_msg} <strong style={{ color: 'var(--text)' }}>{confirmDelete.prenom} {confirmDelete.nom}</strong> {t.confirmer_msg2}
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                style={{ padding: '8px 20px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--panel-soft)', color: 'var(--muted)', cursor: 'pointer', fontWeight: 800 }}
                            >{t.annuler}</button>
                            <button
                                onClick={handleDelete}
                                style={{ padding: '8px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}
                            >{t.retirer}</button>
                        </div>
                    </div>
                </div>
            )}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: 'var(--text)' }}>{t.titre}</h1>
                    <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>{patients.length} {t.nb}</p>
                </div>
                <button
                    onClick={() => { setShowAdd(!showAdd); setEditPatient(null); }}
                    style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 800, fontSize: 14 }}
                >
                    {showAdd ? t.fermer : t.ajouter}
                </button>
            </header>
            {showAdd && (
                <div style={{ ...cardStyle, padding: 20, marginBottom: 16 }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>{t.nouveau}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        {[[t.nom,'nom'],[t.prenom,'prenom'],[t.email,'email'],[t.telephone,'telephone']].map(([l,k]) => (
                            <div key={k}>
                                <label style={lbl}>{l}</label>
                                <input style={inp()} value={addForm.data[k]} onChange={e => addForm.setData(k, e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        ))}
                        <div>
                            <label style={lbl}>{t.password}</label>
                            <input type="password" style={inp()} value={addForm.data.password} onChange={e => addForm.setData('password', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                        </div>
                        <div>
                            <label style={lbl}>{t.password_confirm}</label>
                            <input type="password" style={inp()} value={addForm.data.password_confirmation} onChange={e => addForm.setData('password_confirmation', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                        </div>
                        <div>
                            <label style={lbl}>{t.lien}</label>
                            <select style={inp()} value={addForm.data.lien} onChange={e => addForm.setData('lien', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                {LIENS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>{t.date_naissance}</label>
                            <input type="date" style={inp()} value={addForm.data.date_naissance} onChange={e => addForm.setData('date_naissance', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                        </div>
                        <div>
                            <label style={lbl}>{t.medecin}</label>
                            <select style={inp()} value={addForm.data.medecin_id} onChange={e => addForm.setData('medecin_id', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                <option value="">{t.aucun_medecin}</option>
                                {medecins.map(m => <option key={m.id} value={m.id}>Dr. {m.nom} {m.prenom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={handleAdd} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 800 }}>{t.enregistrer}</button>
                        <button onClick={() => setShowAdd(false)} style={{ background: 'var(--panel-soft)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 800 }}>{t.annuler}</button>
                    </div>
                </div>
            )}
            {editPatient && (
                <div style={{ ...cardStyle, padding: 20, marginBottom: 16, borderLeft: '3px solid var(--amber)' }}>
                    <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>✏️ {editPatient.prenom} {editPatient.nom}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        {[[t.nom,'nom'],[t.prenom,'prenom'],[t.email,'email'],[t.telephone,'telephone']].map(([l,k]) => (
                            <div key={k}>
                                <label style={lbl}>{l}</label>
                                <input style={inp()} value={editForm.data[k]} onChange={e => editForm.setData(k, e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        ))}
                        <div>
                            <label style={lbl}>{t.lien}</label>
                            <select style={inp()} value={editForm.data.lien} onChange={e => editForm.setData('lien', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                {LIENS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>État</label>
                            <select style={inp()} value={editForm.data.etat} onChange={e => editForm.setData('etat', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                {t.etat_options.map(e => <option key={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>{t.medecin}</label>
                            <select style={inp()} value={editForm.data.medecin_id} onChange={e => editForm.setData('medecin_id', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                <option value="">{t.aucun_medecin}</option>
                                {medecins.map(m => <option key={m.id} value={m.id}>Dr. {m.nom} {m.prenom}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={handleEdit} style={{ background: 'var(--amber)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 800 }}>{t.mettre_a_jour}</button>
                        <button onClick={() => setEditPatient(null)} style={{ background: 'var(--panel-soft)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 800 }}>{t.annuler}</button>
                    </div>
                </div>
            )}
            <div style={{ ...cardStyle, padding: '12px 16px', marginBottom: 16 }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...inp(), border: 'none', background: 'transparent', padding: 0 }}
                    placeholder={t.recherche}
                />
            </div>
            <div style={{ ...cardStyle, padding: 20, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                        <tr>
                            {t.cols.map(h => <th key={h} style={th}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id} style={{ borderTop: '1px solid var(--line)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--panel-soft)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,.08)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                                        <span style={{ fontWeight: 800 }}>{p.prenom} {p.nom}</span>
                                    </div>
                                </td>
                                <td style={{ ...td, color: 'var(--muted)' }}>{p.email}</td>
                                <td style={td}>{p.telephone}</td>
                                <td style={td}>
                                    <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{p.lien}</span>
                                </td>
                                <td style={td}>
                                    <span style={{
                                        background: p.etat === 'actif' ? 'rgba(20,184,166,0.1)' : p.etat === 'gueri' ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,.08)',
                                        color: p.etat === 'actif' ? 'var(--teal)' : p.etat === 'gueri' ? 'var(--teal)' : 'var(--red)',
                                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800
                                    }}>{p.etat}</span>
                                </td>
                                <td style={td}>
                                    {p.medecin
                                        ? <div>
                                            <div style={{ fontWeight: 800, fontSize: 13 }}>Dr. {p.medecin.nom} {p.medecin.prenom}</div>
                                            <div style={{ color: 'var(--muted)', fontSize: 11 }}>{p.medecin.specialite}</div>
                                          </div>
                                        : <span style={{ color: 'var(--muted)', fontSize: 12 }}>{t.non_assigne}</span>
                                    }
                                </td>
                                <td style={td}>
                                    <span style={{ fontWeight: 900, color: p.adherence >= 80 ? 'var(--teal)' : p.adherence >= 60 ? 'var(--amber)' : 'var(--red)' }}>
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
                    <div style={{ padding: 22, textAlign: 'center', color: 'var(--muted)', background: 'var(--panel-soft)', borderRadius: 8, marginTop: 12 }}>
                        {t.aucun}
                    </div>
                )}
            </div>

        </AppLayout>
    );
}