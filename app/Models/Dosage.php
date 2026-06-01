<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Temp;            // ✅ ajouté
use App\Models\PriseMedicament; // ✅ ajouté


class Dosage extends Model
{
    /** @use HasFactory<\Database\Factories\DosageFactory> */
    use HasFactory;
     protected $fillable = [
        'ordonnance_id', 'medicament_id', 'duree', 'duree_unite', 'quantite', 'quantite_unite',
    ];

    public function ordonnance()
    {
        return $this->belongsTo(Ordonnance::class);
    }

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }

    public function priseMedicaments()
    {
        return $this->hasMany(PriseMedicament::class);
    }

    /** Génère toutes les prises prévues selon la durée et les temps donnés */
    public function genererPrises(array $tempsIds): void
    {
        $debut = $this->ordonnance->date_prescription;

        $jours = match($this->duree_unite) {
            'semaines' => $this->duree * 7,
            'mois'     => $this->duree * 30,
            default    => $this->duree,   // jours
        };

        $temps = Temp::whereIn('id', $tempsIds)->get();

        for ($day = 0; $day < $jours; $day++) {
            $date = $debut->clone()->addDays($day);

            foreach ($temps as $t) {
                PriseMedicament::create([
                    'dosage_id'   => $this->id,
                    'patient_id'  => $this->ordonnance->patient_id,
                    'temps_id'    => $t->id,
                    'date_prevue' => $date,
                    'heure_prevue'=> $t->heure,
                    'statut'      => 'en_attente',
                ]);
            }
        }
    }
}
