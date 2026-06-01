<?php
namespace App\Console\Commands;

use App\Models\Medicament;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Console\Command;

class AlerteStockFaible extends Command
{
    protected $signature   = 'alerte:stock';
    protected $description = 'Envoie une alerte aux responsables si le stock d\'un médicament est faible';

    public function handle()
    {
        $medicamentsFaibles = Medicament::all()->filter(fn($m) => $m->stockFaible());

        if ($medicamentsFaibles->isEmpty()) {
            $this->info('Aucun stock faible détecté.');
            return;
        }

        $responsables = User::where('role', 'responsable')->get();

        foreach ($responsables as $responsable) {
            foreach ($medicamentsFaibles as $medicament) {
                $dejaEnvoyee = Notification::where('user_id', $responsable->id)
                    ->where('type', 'alerte')
                    ->whereDate('created_at', today())
                    ->where('titre', 'like', "%{$medicament->nom_commercial}%")
                    ->exists();

                if (!$dejaEnvoyee) {
                    Notification::create([
                        'user_id' => $responsable->id,
                        'type'    => 'alerte',
                        'titre'   => "⚠️ Stock faible — {$medicament->nom_commercial}",
                        'message' => "Le stock de {$medicament->nom_commercial} est faible ({$medicament->quantite_stock} unités restantes). Pensez à réapprovisionner.",
                        'data'    => ['medicament_id' => $medicament->id],
                    ]);

                    $this->info("Alerte stock envoyée pour {$medicament->nom_commercial}");
                }
            }
        }

        $this->info('Alertes stock terminées.');
    }
}