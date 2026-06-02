import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout';
import { useLang } from "../../hooks/useLang";
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

const inputStyle = (hasError = false) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${hasError ? C.red : C.border}`,
    borderRadius: 10,
    fontSize: 14,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: C.text,
    outline: 'none',
});

const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: C.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const text = {
    fr: {
        titre: '💊 Médicaments', nb: 'médicament(s)', ajouter: '+ Ajouter',
        cols: ['Médicament', 'Forme', 'Stock', 'Statut', 'Actions'],
        faible: '⚠️ Faible', ok: '✅ OK',
        modal_add: '➕ Nouveau médicament', modal_edit: '✏️ Modifier médicament',
        modal_stock: '📦 Réapprovisionner', stock_actuel: 'Stock actuel :',
        qte: 'Quantité à ajouter', nom: 'Nom commercial',
        stock_init: 'Stock initial', forme: 'Forme', stock_champ: 'Stock',
        annuler: 'Annuler', confirmer: 'Confirmer',
        enregistrer: 'Enregistrer', ajouter_btn: 'Ajouter',
        supprimer_confirm: 'Supprimer ce médicament ?',
        photo: 'Photo du médicament', photo_hint: 'Cliquez pour choisir une image',
        photo_changer: 'Changer la photo',
        formes: { comprime: '💊 Comprimé', sirop: '🧴 Sirop', injectable: '💉 Injectable', capsule: '🔵 Capsule', autre: '💊 Autre' },
    },
    en: {
        titre: '💊 Medications', nb: 'medication(s)', ajouter: '+ Add',
        cols: ['Medication', 'Form', 'Stock', 'Status', 'Actions'],
        faible: '⚠️ Low', ok: '✅ OK',
        modal_add: '➕ New medication', modal_edit: '✏️ Edit medication',
        modal_stock: '📦 Restock', stock_actuel: 'Current stock:',
        qte: 'Quantity to add', nom: 'Brand name',
        stock_init: 'Initial stock', forme: 'Form', stock_champ: 'Stock',
        annuler: 'Cancel', confirmer: 'Confirm',
        enregistrer: 'Save', ajouter_btn: 'Add',
        supprimer_confirm: 'Delete this medication?',
        photo: 'Medication photo', photo_hint: 'Click to choose an image',
        photo_changer: 'Change photo',
        formes: { comprime: '💊 Tablet', sirop: '🧴 Syrup', injectable: '💉 Injectable', capsule: '🔵 Capsule', autre: '💊 Other' },
    },
    ar: {
        titre: '💊 الأدوية', nb: 'دواء', ajouter: '+ إضافة',
        cols: ['الدواء', 'الشكل', 'المخزون', 'الحالة', 'الإجراءات'],
        faible: '⚠️ منخفض', ok: '✅ جيد',
        modal_add: '➕ دواء جديد', modal_edit: '✏️ تعديل الدواء',
        modal_stock: '📦 إعادة التخزين', stock_actuel: 'المخزون الحالي:',
        qte: 'الكمية المضافة', nom: 'الاسم التجاري',
        stock_init: 'المخزون الأولي', forme: 'الشكل', stock_champ: 'المخزون',
        annuler: 'إلغاء', confirmer: 'تأكيد',
        enregistrer: 'حفظ', ajouter_btn: 'إضافة',
        supprimer_confirm: 'حذف هذا الدواء؟',
        photo: 'صورة الدواء', photo_hint: 'انقر لاختيار صورة',
        photo_changer: 'تغيير الصورة',
        formes: { comprime: '💊 قرص', sirop: '🧴 شراب', injectable: '💉 حقنة', capsule: '🔵 كبسولة', autre: '💊 أخرى' },
    },
};

// ── Photo Upload Field ──────────────────────────────────────────────────────
function PhotoUpload({ label, hint, changeLabel, preview, onFileChange }) {
    const inputRef = useRef();
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{label}</label>
            <div
                onClick={() => inputRef.current.click()}
                style={{
                    border: `2px dashed ${C.border}`,
                    borderRadius: 10,
                    padding: preview ? 8 : '20px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
                {preview ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={preview} alt="preview" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, border: `1px solid ${C.border}` }} />
                        <span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>🔄 {changeLabel}</span>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                        <div style={{ fontSize: 13, color: C.textMuted }}>{hint}</div>
                    </>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onFileChange}
            />
        </div>
    );
}

export default function Medicaments({ medicaments = [] }) {
    const lang = useLang();
    const t = text[lang] || text.fr;

    const [showAdd, setShowAdd]     = useState(false);
    const [showStock, setShowStock] = useState(null);
    const [showEdit, setShowEdit]   = useState(null);

    // Add form state
    const [form, setForm]           = useState({ nom_commercial: '', forme: 'comprime', quantite_stock: 0 });
    const [addPhotoFile, setAddPhotoFile]     = useState(null);
    const [addPhotoPreview, setAddPhotoPreview] = useState(null);

    // Edit form state
    const [editPhotoFile, setEditPhotoFile]     = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);

    const [stockQty, setStockQty]   = useState(1);

    // ── Handle photo selection ──────────────────────────────────────────────
    const handleAddPhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAddPhotoFile(file);
        setAddPhotoPreview(URL.createObjectURL(file));
    };

    const handleEditPhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setEditPhotoFile(file);
        setEditPhotoPreview(URL.createObjectURL(file));
    };

    // ── CRUD actions ────────────────────────────────────────────────────────
    const submit = () => {
        const data = new FormData();
        data.append('nom_commercial',  form.nom_commercial);
        data.append('quantite_stock',  form.quantite_stock);
        data.append('forme',           form.forme);
        if (addPhotoFile) data.append('photo_boite', addPhotoFile);

        router.post('/responsable/medicaments', data, {
            forceFormData: true,
            onSuccess: () => {
                setShowAdd(false);
                setForm({ nom_commercial: '', forme: 'comprime', quantite_stock: 0 });
                setAddPhotoFile(null);
                setAddPhotoPreview(null);
            },
        });
    };

    const update = () => {
        const data = new FormData();
        data.append('_method',         'PATCH');
        data.append('nom_commercial',  showEdit.nom_commercial);
        data.append('quantite_stock',  showEdit.quantite_stock);
        data.append('forme',           showEdit.forme);
        if (editPhotoFile) data.append('photo_boite', editPhotoFile);

        router.post(`/responsable/medicaments/${showEdit.id}`, data, {
            forceFormData: true,
            onSuccess: () => {
                setShowEdit(null);
                setEditPhotoFile(null);
                setEditPhotoPreview(null);
            },
        });
    };

    const destroy = (id) => {
        if (confirm(t.supprimer_confirm)) router.delete(`/responsable/medicaments/${id}`);
    };

    const reappro = () => router.patch(
        `/responsable/medicaments/${showStock.id}/stock`,
        { quantite: stockQty },
        { onSuccess: () => setShowStock(null) }
    );

    const getFormeIcon = (forme) => {
        const icons = {
            comprime: '💊',
            sirop: '🧴',
            injectable: '💉',
            capsule: '🔵',
            autre: '💊'
        };
        return icons[forme] || '💊';
    };

    return (
        <AppLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.text }}>{t.titre}</h1>
                    <p style={{ color: C.textMuted, fontSize: 14, marginTop: 4 }}>{medicaments.length} {t.nb}</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    style={{ background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(129,140,248,0.35)' }}
                >{t.ajouter}</button>
            </div>
            <div style={{ ...glass({ overflow: 'hidden', padding: 0 }) }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            {t.cols.map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textHint, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {medicaments.map((m, i) => (
                            <tr key={m.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                                <td style={{ padding: '14px 16px', fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {m.photo_boite
                                        ? <img src={`/storage/${m.photo_boite}`} alt={m.nom_commercial} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, border: `1px solid ${C.border}` }} />
                                        : <span style={{ fontSize: 24 }}>{getFormeIcon(m.forme)}</span>
                                    }
                                    {m.nom_commercial}
                                </td>
                                <td style={{ padding: '14px 16px', color: C.textMuted }}>{t.formes[m.forme] || m.forme}</td>
                                <td style={{ padding: '14px 16px', fontWeight: 700, color: C.text }}>{m.quantite_stock}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    {m.stock_faible
                                        ? <span style={{ backgroundColor: C.redSoft, color: C.red, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.faible}</span>
                                        : <span style={{ backgroundColor: C.greenSoft, color: C.green, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.ok}</span>
                                    }
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => { setShowStock(m); setStockQty(1); }} style={{ backgroundColor: C.blueSoft, color: C.blue, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📦</button>
                                        <button onClick={() => { setShowEdit({ ...m }); setEditPhotoPreview(m.photo_boite ? `/storage/${m.photo_boite}` : null); setEditPhotoFile(null); }} style={{ backgroundColor: C.greenSoft, color: C.green, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️</button>
                                        <button onClick={() => destroy(m.id)} style={{ backgroundColor: C.redSoft, color: C.red, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Modal Ajouter ── */}
            {showAdd && (
                <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ ...glass({ padding: 32 }), maxWidth: 440, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: C.text }}>{t.modal_add}</h3>
                        <PhotoUpload
                            label={t.photo}
                            hint={t.photo_hint}
                            changeLabel={t.photo_changer}
                            preview={addPhotoPreview}
                            onFileChange={handleAddPhoto}
                        />
                        {[[t.nom, 'nom_commercial', 'text'], [t.stock_init, 'quantite_stock', 'number']].map(([label, key, type]) => (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>{label}</label>
                                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle()} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>{t.forme}</label>
                            <select value={form.forme} onChange={e => setForm({ ...form, forme: e.target.value })} style={inputStyle()}>
                                {Object.entries(t.formes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => { setShowAdd(false); setAddPhotoFile(null); setAddPhotoPreview(null); }} style={{ flex: 1, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.annuler}</button>
                            <button onClick={submit} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{t.ajouter_btn}</button>
                        </div>
                    </div>
                </div>
            )}
            {showStock && (
                <div onClick={() => setShowStock(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ ...glass({ padding: 32 }), maxWidth: 360, width: '90%' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: C.text }}>{t.modal_stock}</h3>
                        <p style={{ color: C.textMuted, marginBottom: 20 }}>{showStock.nom_commercial} — {t.stock_actuel} <strong style={{ color: C.text }}>{showStock.quantite_stock}</strong></p>
                        <label style={labelStyle}>{t.qte}</label>
                        <input type="number" min="1" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} style={{ ...inputStyle(), marginBottom: 20 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowStock(null)} style={{ flex: 1, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.annuler}</button>
                            <button onClick={reappro} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#34D399,#059669)', color: '#0F1535', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{t.confirmer}</button>
                        </div>
                    </div>
                </div>
            )}
            {showEdit && (
                <div onClick={() => setShowEdit(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ ...glass({ padding: 32 }), maxWidth: 440, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: C.text }}>{t.modal_edit}</h3>
                        <PhotoUpload
                            label={t.photo}
                            hint={t.photo_hint}
                            changeLabel={t.photo_changer}
                            preview={editPhotoPreview}
                            onFileChange={handleEditPhoto}
                        />
                        {[[t.nom, 'nom_commercial', 'text'], [t.stock_champ, 'quantite_stock', 'number']].map(([label, key, type]) => (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>{label}</label>
                                <input type={type} value={showEdit[key]} onChange={e => setShowEdit({ ...showEdit, [key]: e.target.value })} style={inputStyle()} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>{t.forme}</label>
                            <select value={showEdit.forme} onChange={e => setShowEdit({ ...showEdit, forme: e.target.value })} style={inputStyle()}>
                                {Object.entries(t.formes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => { setShowEdit(null); setEditPhotoFile(null); setEditPhotoPreview(null); }} style={{ flex: 1, padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: C.textMuted }}>{t.annuler}</button>
                            <button onClick={update} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#818CF8,#6366F1)', color: C.white, border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{t.enregistrer}</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}