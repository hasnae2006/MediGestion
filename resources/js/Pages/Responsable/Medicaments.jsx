import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from '../../hooks/useLang';

const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
};

const inputStyle = (hasError = false) => ({
    width: '100%', padding: '10px 14px',
    border: hasError ? '1.5px solid var(--red)' : '1px solid var(--line)',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
    background: 'var(--panel-soft)', color: 'var(--text)', outline: 'none',
    colorScheme: 'dark',
});

const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 800,
    color: 'var(--muted)', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.05em',
};

const text = {
    fr: { titre: '💊 Médicaments', nb: 'médicament(s)', ajouter: '+ Ajouter', cols: ['Médicament','Forme','Stock','Statut','Actions'], faible: '⚠️ Faible', ok: '✅ OK', modal_add: '➕ Nouveau médicament', modal_edit: '✏️ Modifier médicament', modal_stock: '📦 Réapprovisionner', stock_actuel: 'Stock actuel :', qte: 'Quantité à ajouter', nom: 'Nom commercial', stock_init: 'Stock initial', forme: 'Forme', stock_champ: 'Stock', annuler: 'Annuler', confirmer: 'Confirmer', enregistrer: 'Enregistrer', ajouter_btn: 'Ajouter', supprimer_confirm: 'Supprimer ce médicament ?', photo: 'Photo du médicament', photo_hint: 'Cliquez pour choisir une image', photo_changer: 'Changer la photo', formes: { comprime: '💊 Comprimé', sirop: '🧴 Sirop', injectable: '💉 Injectable', capsule: '🔵 Capsule', autre: '💊 Autre' } },
    en: { titre: '💊 Medications', nb: 'medication(s)', ajouter: '+ Add', cols: ['Medication','Form','Stock','Status','Actions'], faible: '⚠️ Low', ok: '✅ OK', modal_add: '➕ New medication', modal_edit: '✏️ Edit medication', modal_stock: '📦 Restock', stock_actuel: 'Current stock:', qte: 'Quantity to add', nom: 'Brand name', stock_init: 'Initial stock', forme: 'Form', stock_champ: 'Stock', annuler: 'Cancel', confirmer: 'Confirm', enregistrer: 'Save', ajouter_btn: 'Add', supprimer_confirm: 'Delete this medication?', photo: 'Medication photo', photo_hint: 'Click to choose an image', photo_changer: 'Change photo', formes: { comprime: '💊 Tablet', sirop: '🧴 Syrup', injectable: '💉 Injectable', capsule: '🔵 Capsule', autre: '💊 Other' } },
    ar: { titre: '💊 الأدوية', nb: 'دواء', ajouter: '+ إضافة', cols: ['الدواء','الشكل','المخزون','الحالة','الإجراءات'], faible: '⚠️ منخفض', ok: '✅ جيد', modal_add: '➕ دواء جديد', modal_edit: '✏️ تعديل الدواء', modal_stock: '📦 إعادة التخزين', stock_actuel: 'المخزون الحالي:', qte: 'الكمية المضافة', nom: 'الاسم التجاري', stock_init: 'المخزون الأولي', forme: 'الشكل', stock_champ: 'المخزون', annuler: 'إلغاء', confirmer: 'تأكيد', enregistrer: 'حفظ', ajouter_btn: 'إضافة', supprimer_confirm: 'حذف هذا الدواء؟', photo: 'صورة الدواء', photo_hint: 'انقر لاختيار صورة', photo_changer: 'تغيير الصورة', formes: { comprime: '💊 قرص', sirop: '🧴 شراب', injectable: '💉 حقنة', capsule: '🔵 كبسولة', autre: '💊 أخرى' } },
};

function PhotoUpload({ label, hint, changeLabel, preview, onFileChange }) {
    const inputRef = useRef();
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{label}</label>
            <div onClick={() => inputRef.current.click()} style={{ border: '2px dashed var(--line)', borderRadius: 8, padding: preview ? 8 : '20px 14px', textAlign: 'center', cursor: 'pointer', background: 'var(--panel-soft)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
            >
                {preview ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={preview} alt="preview" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--line)' }} />
                        <span style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 700 }}>🔄 {changeLabel}</span>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{hint}</div>
                    </>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
        </div>
    );
}

export default function Medicaments({ medicaments = [] }) {
    const lang = useLang();
    const t = text[lang] || text.fr;
    const [showAdd, setShowAdd]     = useState(false);
    const [showStock, setShowStock] = useState(null);
    const [showEdit, setShowEdit]   = useState(null);
    const [form, setForm]           = useState({ nom_commercial: '', forme: 'comprime', quantite_stock: 0 });
    const [addPhotoFile, setAddPhotoFile]         = useState(null);
    const [addPhotoPreview, setAddPhotoPreview]   = useState(null);
    const [editPhotoFile, setEditPhotoFile]       = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);
    const [stockQty, setStockQty] = useState(1);

    const handleAddPhoto  = e => { const f = e.target.files[0]; if (!f) return; setAddPhotoFile(f); setAddPhotoPreview(URL.createObjectURL(f)); };
    const handleEditPhoto = e => { const f = e.target.files[0]; if (!f) return; setEditPhotoFile(f); setEditPhotoPreview(URL.createObjectURL(f)); };

    const submit = () => {
        const data = new FormData();
        data.append('nom_commercial', form.nom_commercial);
        data.append('quantite_stock', form.quantite_stock);
        data.append('forme', form.forme);
        if (addPhotoFile) data.append('photo_boite', addPhotoFile);
        router.post('/responsable/medicaments', data, { forceFormData: true, onSuccess: () => { setShowAdd(false); setForm({ nom_commercial: '', forme: 'comprime', quantite_stock: 0 }); setAddPhotoFile(null); setAddPhotoPreview(null); } });
    };

    const update = () => {
        const data = new FormData();
        data.append('_method', 'PATCH');
        data.append('nom_commercial', showEdit.nom_commercial);
        data.append('quantite_stock', showEdit.quantite_stock);
        data.append('forme', showEdit.forme);
        if (editPhotoFile) data.append('photo_boite', editPhotoFile);
        router.post(`/responsable/medicaments/${showEdit.id}`, data, { forceFormData: true, onSuccess: () => { setShowEdit(null); setEditPhotoFile(null); setEditPhotoPreview(null); } });
    };

    const destroy  = (id) => { if (confirm(t.supprimer_confirm)) router.delete(`/responsable/medicaments/${id}`); };
    const reappro  = () => router.patch(`/responsable/medicaments/${showStock.id}/stock`, { quantite: stockQty }, { onSuccess: () => setShowStock(null) });
    const formeIcon = (f) => ({ comprime: '💊', sirop: '🧴', injectable: '💉', capsule: '🔵', autre: '💊' }[f] || '💊');

    const modalOuter = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };

    return (
        <AppLayout>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: 'var(--text)' }}>{t.titre}</h1>
                    <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{medicaments.length} {t.nb}</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>{t.ajouter}</button>
            </header>

            <div style={{ ...cardStyle, overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {t.cols.map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {medicaments.map((m, i) => (
                            <tr key={m.id} style={{ borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--panel-soft)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {m.photo_boite ? <img src={`/storage/${m.photo_boite}`} alt={m.nom_commercial} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--line)' }} /> : <span style={{ fontSize: 24 }}>{formeIcon(m.forme)}</span>}
                                    {m.nom_commercial}
                                </td>
                                <td style={{ padding: '14px 12px', color: 'var(--muted)' }}>{t.formes[m.forme] || m.forme}</td>
                                <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--text)' }}>{m.quantite_stock}</td>
                                <td style={{ padding: '14px 12px' }}>
                                    {m.stock_faible
                                        ? <span style={{ background: 'rgba(239,68,68,.08)', color: 'var(--red)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{t.faible}</span>
                                        : <span style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{t.ok}</span>
                                    }
                                </td>
                                <td style={{ padding: '14px 12px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => { setShowStock(m); setStockQty(1); }} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--blue)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>📦</button>
                                        <button onClick={() => { setShowEdit({ ...m }); setEditPhotoPreview(m.photo_boite ? `/storage/${m.photo_boite}` : null); setEditPhotoFile(null); }} style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>✏️</button>
                                        <button onClick={() => destroy(m.id)} style={{ background: 'rgba(239,68,68,.08)', color: 'var(--red)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAdd && (
                <div onClick={() => setShowAdd(false)} style={modalOuter}>
                    <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, padding: 32, maxWidth: 440, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>{t.modal_add}</h3>
                        <PhotoUpload label={t.photo} hint={t.photo_hint} changeLabel={t.photo_changer} preview={addPhotoPreview} onFileChange={handleAddPhoto} />
                        {[[t.nom,'nom_commercial','text'],[t.stock_init,'quantite_stock','number']].map(([lbl,key,type]) => (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>{lbl}</label>
                                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle()} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>{t.forme}</label>
                            <select value={form.forme} onChange={e => setForm({ ...form, forme: e.target.value })} style={inputStyle()}>
                                {Object.entries(t.formes).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => { setShowAdd(false); setAddPhotoFile(null); setAddPhotoPreview(null); }} style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.annuler}</button>
                            <button onClick={submit} style={{ flex: 1, padding: 12, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>{t.ajouter_btn}</button>
                        </div>
                    </div>
                </div>
            )}

            {showStock && (
                <div onClick={() => setShowStock(null)} style={modalOuter}>
                    <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, padding: 32, maxWidth: 360, width: '90%' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, color: 'var(--text)' }}>{t.modal_stock}</h3>
                        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>{showStock.nom_commercial} — {t.stock_actuel} <strong style={{ color: 'var(--text)' }}>{showStock.quantite_stock}</strong></p>
                        <label style={labelStyle}>{t.qte}</label>
                        <input type="number" min="1" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} style={{ ...inputStyle(), marginBottom: 20 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowStock(null)} style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.annuler}</button>
                            <button onClick={reappro} style={{ flex: 1, padding: 12, background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>{t.confirmer}</button>
                        </div>
                    </div>
                </div>
            )}

            {showEdit && (
                <div onClick={() => setShowEdit(null)} style={modalOuter}>
                    <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, padding: 32, maxWidth: 440, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>{t.modal_edit}</h3>
                        <PhotoUpload label={t.photo} hint={t.photo_hint} changeLabel={t.photo_changer} preview={editPhotoPreview} onFileChange={handleEditPhoto} />
                        {[[t.nom,'nom_commercial','text'],[t.stock_champ,'quantite_stock','number']].map(([lbl,key,type]) => (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>{lbl}</label>
                                <input type={type} value={showEdit[key]} onChange={e => setShowEdit({ ...showEdit, [key]: e.target.value })} style={inputStyle()} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>{t.forme}</label>
                            <select value={showEdit.forme} onChange={e => setShowEdit({ ...showEdit, forme: e.target.value })} style={inputStyle()}>
                                {Object.entries(t.formes).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => { setShowEdit(null); setEditPhotoFile(null); setEditPhotoPreview(null); }} style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 8, fontWeight: 800, cursor: 'pointer', background: 'var(--panel-soft)', color: 'var(--muted)' }}>{t.annuler}</button>
                            <button onClick={update} style={{ flex: 1, padding: 12, background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>{t.enregistrer}</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}