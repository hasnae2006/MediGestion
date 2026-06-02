<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
   /** @use HasFactory<\Database\Factories\MedicamentFactory> */
    use HasFactory;
    protected $fillable = [
        'nom_commercial', 'forme', 'photo_boite', 'quantite_stock',
    ];

    public function dosages()
    {
        return $this->hasMany(Dosage::class);
    }

    public function stockFaible(int $seuil = 10): bool
    {
        return $this->quantite_stock <= $seuil;
    }
}
