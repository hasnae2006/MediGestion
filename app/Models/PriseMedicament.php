<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriseMedicament extends Model
{
   /** @use HasFactory<\Database\Factories\PriseMedicamentFactory> */
    use HasFactory;
   protected $table = 'prise_medicaments';

    protected $fillable = [
        'dosage_id', 'patient_id', 'temps_id',
        'date_prevue', 'heure_prevue',
        'date_prise_reelle', 'heure_prise_reelle',
        'statut',
    ];

    protected $casts = [
        'date_prevue'       => 'date',
        'date_prise_reelle' => 'date',
    ];

    public function dosage()
    {
        return $this->belongsTo(Dosage::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function temps()
    {
        return $this->belongsTo(Temp::class);
    }

    /** Confirme la prise maintenant */
    public function confirmer(): void
    {
        $this->update([
            'statut'            => 'pris',
            'date_prise_reelle' => now()->toDateString(),
            'heure_prise_reelle'=> now()->toTimeString(),
        ]);
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeManquees($query)
    {
        return $query->where('statut', 'manque');
    }

    public function scopeAujourdhui($query)
    {
        return $query->whereDate('date_prevue', today());
    }
} 
