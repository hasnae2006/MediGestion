<?php
namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Ordonnance;
use Illuminate\Console\Command;

class RappelOrdonnanceExpire extends Command
{
    protected $signature   = 'rappel:ordonnances';
    protected $description = 'Envoie un rappel pour les ordonnances actives de plus de 30 jours';

    public function handle()
    {
        $limite = now()->subDays(30)->toDateString();

        $ordonnances = Ordonnance::with(['patient.user'])
            ->where('active', true)
            ->whereDate('date_prescription', '<=', $limite)
            ->get();

        foreach ($ordonnances as $ordonnance) {
            $patient     = $ordonnance->patient;
            $responsable = $patient->responsableActif();
            $jours       = now()->diffInDays($ordonnance->date_prescription);

            // Notification au patient
            $dejaEnvoyee = Notification::where('user_id', $patient->user_id)
                ->where('type', 'info')
                ->whereDate('created_at', today())
                ->where('titre', 'like', '%Ordonnance%')
                ->exists();

            if (!$dejaEnvoyee) {
                Notification::create([
                    'user_id' => $patient->user_id,
                    'type'    => 'info',
                    'titre'   => '📅 Ordonnance ancienne',
                    'message' => "Votre ordonnance du {$ordonnance->date_prescription->format('d/m/Y')} a plus de {$jours} jours. Consultez votre médecin pour un renouvellement.",
                    'data'    => ['ordonnance_id' => $ordonnance->id],
                ]);

                // Notification au responsable
                if ($responsable) {
                    Notification::create([
                        'user_id' => $responsable->id,
                        'type'    => 'info',
                        'titre'   => "📅 Ordonnance ancienne — {$patient->nomComplet()}",
                        'message' => "L'ordonnance de {$patient->nomComplet()} du {$ordonnance->date_prescription->format('d/m/Y')} a plus de {$jours} jours. Pensez au renouvellement.",
                        'data'    => ['ordonnance_id' => $ordonnance->id, 'patient_id' => $patient->id],
                    ]);
                }

                $this->info("Rappel envoyé pour {$patient->nomComplet()}");
            }
        }

        $this->info('Rappels ordonnances terminés — ' . $ordonnances->count() . ' ordonnance(s) traitée(s).');
    }
}