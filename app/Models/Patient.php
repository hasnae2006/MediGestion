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
    public function user()
    {
        return $this->belongsTo(User::class);
    }

   
    public function responsables() //historique via pivot
    {
        return $this->belongsToMany(User::class, 'patient_responsable', 'patient_id', 'responsable_id')
                    ->withPivot(['date_debut', 'date_fin', 'actif'])
                    ->withTimestamps();
    }

    public function responsableActif()
    {
        return $this->responsables()->wherePivot('actif', true)->first();
    }
    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class);
    }
    public function priseMedicaments()
    {
        return $this->hasMany(PriseMedicament::class);
    }
    public function sosAlertes()
    {
        return $this->hasMany(SosAlerte::class);
    }

    public function scopeActifs($query) //Scopes
    {
        return $query->where('etat', 'actif');
    }

    public function nomComplet(): string //helper
    {
        return $this->user?->nomComplet() ?? 'Inconnu';
    }

    // TauxAdh de prises confirmées sur les 30 derniers jours 
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
