<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medecin extends Model {
    protected $fillable = ['nom', 'prenom', 'specialite', 'telephone', 'email'];

    public function patients() {
        return $this->hasMany(Patient::class);
    }
}