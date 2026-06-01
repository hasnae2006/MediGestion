<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SosAlerteSeeder extends Seeder
{
    public function run(): void
    {
        $sosAlertes = [
            [
                'patient_id'      => 1,  // Hasnae
                'responsable_id'  => 1,  // Douae (actif)
                'message'         => 'Je me sens très mal, j\'ai besoin d\'aide immédiatement.',
                'statut'          => 'traite',
                'created_at'      => now()->subDays(5),
                'updated_at'      => now()->subDays(5),
            ],
            [
                'patient_id'      => 1,  // Hasnae
                'responsable_id'  => 1,  // Douae (actif)
                'message'         => 'Douleurs abdominales intenses depuis ce matin.',
                'statut'          => 'lu',
                'created_at'      => now()->subDays(2),
                'updated_at'      => now()->subDays(2),
            ],
            [
                'patient_id'      => 1,  // Hasnae
                'responsable_id'  => 1,  // Douae (actif)
                'message'         => 'J\'ai oublié de prendre mon Oméprazole, que faire ?',
                'statut'          => 'envoye',
                'created_at'      => now()->subHours(3),
                'updated_at'      => now()->subHours(3),
            ],
            [
                'patient_id'      => 2,  // Saber
                'responsable_id'  => 2,  // Fatine (actif)
                'message'         => 'Mon taux de glycémie est très élevé ce matin.',
                'statut'          => 'traite',
                'created_at'      => now()->subDays(7),
                'updated_at'      => now()->subDays(7),
            ],
            [
                'patient_id'      => 2,  // Saber
                'responsable_id'  => 2,  // Fatine (actif)
                'message'         => 'Je n\'ai plus de Glucophage 850mg, stock épuisé.',
                'statut'          => 'envoye',
                'created_at'      => now()->subHours(1),
                'updated_at'      => now()->subHours(1),
            ],
        ];

        DB::table('sos_alertes')->insert($sosAlertes);
    }
}