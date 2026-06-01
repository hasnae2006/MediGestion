<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Temp extends Model
{
    /** @use HasFactory<\Database\Factories\TempFactory> */
    use HasFactory;
    protected $table = 'temps';
    protected $fillable = ['nom', 'heure'];

    public function priseMedicaments()
    {
        return $this->hasMany(PriseMedicament::class);
    }
}

