<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{/** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'date_naissance', 'photo', 'lien', 'etat','adresse', 'medecin_id',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    // ─── Relations ────────────────────────────────────────────

    /** Compte utilisateur lié */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /** Responsables (historique via pivot) */
    public function responsables()
    {
        return $this->belongsToMany(User::class, 'patient_responsable', 'patient_id', 'responsable_id')
                    ->withPivot(['date_debut', 'date_fin', 'actif'])
                    ->withTimestamps();
    }

    /** Responsable actuellement actif */
    public function responsableActif()
    {
        return $this->responsables()->wherePivot('actif', true)->first();
    }

    /** Ordonnances */
    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class);
    }

    /** Prises de médicaments */
    public function priseMedicaments()
    {
        return $this->hasMany(PriseMedicament::class);
    }

    /** Alertes SOS envoyées */
    public function sosAlertes()
    {
        return $this->hasMany(SosAlerte::class);
    }

    // ─── Scopes ───────────────────────────────────────────────

    public function scopeActifs($query)
    {
        return $query->where('etat', 'actif');
    }

    // ─── Helpers ──────────────────────────────────────────────

    public function nomComplet(): string
    {
        return $this->user?->nomComplet() ?? 'Inconnu';
    }

    /** Taux d'adhérence : % de prises confirmées sur les 30 derniers jours */
    public function tauxAdherence(): int
    {
        $total = $this->priseMedicaments()
                      ->where('date_prevue', '>=', now()->subDays(30))
                      ->whereIn('statut', ['pris', 'manque'])
                      ->count();

        if ($total === 0) return 0;

        $pris = $this->priseMedicaments()
                     ->where('date_prevue', '>=', now()->subDays(30))
                     ->where('statut', 'pris')
                     ->count();

        return (int) round($pris * 100 / $total);
    }
    public function medecin() {
    return $this->belongsTo(Medecin::class);
}
}
