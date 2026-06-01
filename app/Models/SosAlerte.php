<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SosAlerte extends Model
{    /** @use HasFactory<\Database\Factories\SosAlerteFactory> */
    use HasFactory;
    // ❗ Migration crée 'sos_alertes' (avec underscore simple)
    protected $table = 'sos_alertes';

    protected $fillable = [
        'patient_id', 'responsable_id', 'message', 'statut',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function scopeNonTraitees($query)
    {
        return $query->whereIn('statut', ['envoye', 'lu']);
    }
}
