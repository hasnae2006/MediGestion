<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;  // ← missing

class patient_responsableSeeder extends Seeder
{
    public function run(): void
    {
        // Hasnae (user_id=3, patient_id=1) — responsable: Douae (resp_id=1)
        $p1 = Patient::find(1);

        // Saber (user_id=4, patient_id=2) — responsable: Fatine (resp_id=2)
        $p2 = Patient::find(2);

        // ══════════════════════════════════════════
        // TABLE PIVOT patient_responsable
        // ══════════════════════════════════════════

        // Hasnae : ancien responsable = Fatine, nouveau = Douae
        $p1->responsables()->attach(2, [  // Fatine (ancien)
            'date_debut' => now()->subYear(),
            'date_fin'   => now()->subMonths(3),
            'actif'      => false,
        ]);
        $p1->responsables()->attach(1, [  // Douae (actif)
            'date_debut' => now()->subMonths(3),
            'date_fin'   => null,
            'actif'      => true,
        ]);

        // Saber : Fatine actif
        $p2->responsables()->attach(2, [  // Fatine (actif)
            'date_debut' => now()->subMonths(1),
            'date_fin'   => null,
            'actif'      => true,
        ]);
    }
}