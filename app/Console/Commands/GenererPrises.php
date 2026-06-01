<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Dosage;
use App\Models\PriseMedicament;
use App\Models\Temp;
use Carbon\Carbon;

class GenererPrises extends Command
{
    protected $signature = 'prises:generer';
    protected $description = 'Génère les prises depuis les ordonnances actives';

    public function handle()
    {
        $tempsIds = [1, 2, 4];
        $temps = Temp::whereIn('id', $tempsIds)->get();

        Dosage::with('ordonnance')->get()->each(function($dosage) use ($temps) {
            $debut = Carbon::parse($dosage->ordonnance->date_prescription);
            $jours = match($dosage->duree_unite) {
                'semaines' => $dosage->duree * 7,
                'mois'     => $dosage->duree * 30,
                default    => $dosage->duree,
            };

            for ($day = 0; $day < $jours; $day++) {
                $date = $debut->clone()->addDays($day);
                foreach ($temps as $t) {
                    PriseMedicament::firstOrCreate([
                        'dosage_id'    => $dosage->id,
                        'patient_id'   => $dosage->ordonnance->patient_id,
                        'temps_id'     => $t->id,
                        'date_prevue'  => $date->toDateString(),
                        'heure_prevue' => $t->heure,
                    ], ['statut' => 'en_attente']);
                }
            }
            $this->info("Dosage {$dosage->id} généré ✅");
        });

        $this->info('Toutes les prises ont été générées !');
    }
}