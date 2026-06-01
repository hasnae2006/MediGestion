<?php
namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\PriseMedicament;
use Illuminate\Console\Command;

class RappelPriseMedicamen extends Command
{
    protected $signature   = 'rappel:prises';
    protected $description = 'Envoie des rappels 30 min avant chaque prise de médicament';

    public function handle()
    {
        $maintenant  = now();
        $dans30min   = $maintenant->copy()->addMinutes(30);

        $prises = PriseMedicament::with(['patient.user', 'dosage.medicament'])
            ->where('statut', 'en_attente')
            ->whereDate('date_prevue', today())
            ->whereTime('heure_prevue', '>=', $maintenant->format('H:i:s'))
            ->whereTime('heure_prevue', '<=', $dans30min->format('H:i:s'))
            ->get();

        foreach ($prises as $prise) {
            $patient    = $prise->patient;
            $medicament = $prise->dosage->medicament->nom_commercial ?? 'Médicament';
            $heure      = $prise->heure_prevue;

            // Vérifier si notification déjà envoyée
            $dejaEnvoyee = Notification::where('user_id', $patient->user_id)
                ->where('type', 'rappel')
                ->where('created_at', '>=', $maintenant->copy()->subMinutes(35))
                ->where('message', 'like', "%{$medicament}%")
                ->exists();

            if (!$dejaEnvoyee) {
                Notification::create([
                    'user_id' => $patient->user_id,
                    'type'    => 'rappel',
                    'titre'   => "⏰ Rappel — {$medicament}",
                    'message' => "N'oubliez pas de prendre votre médicament {$medicament} à {$heure}.",
                    'data'    => ['prise_id' => $prise->id],
                ]);

                $this->info("Rappel envoyé à {$patient->user->prenom} pour {$medicament}");
            }
        }

        $this->info('Rappels prises terminés — ' . $prises->count() . ' prise(s) traitée(s).');
    }
}