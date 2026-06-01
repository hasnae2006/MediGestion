<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordonnance extends Model
{
    /** @use HasFactory<\Database\Factories\OrdonnanceFactory> */
    use HasFactory;

    protected $fillable = [
        'patient_id', 'responsable_id', 'date_prescription', 'nom_medecin', 'active',
    ];

    protected $casts = [
        'date_prescription' => 'date',
        'active'            => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function dosages()
    {
        return $this->hasMany(Dosage::class);
    }
}
