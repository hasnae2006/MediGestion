<?php
namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DosageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('dosages')->insert([

            // ── Ordonnance 1 : Gaviscon pour Hasnae
            // Original : '10 ml-20 ml' → quantite min = 10.00, unite = 'ml (10 à 20 ml)'
            [
                'ordonnance_id'  => 1,
                'medicament_id'  => 1, // Gaviscon
                'duree'          => 14,
                'duree_unite'    => 'jours',
                'quantite'       => 10.00,           // ✅ valeur minimale décimale
                'quantite_unite' => 'ml (10 à 20 ml)',  // ✅ la précision dans l'unité
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 1 : Amoxicilline pour Hasnae
            // Original : '1g-2g' → quantite = 1.00, unite = 'g (1g à 2g)'
            [
                'ordonnance_id'  => 1,
                'medicament_id'  => 2, // Amoxicilline
                'duree'          => 10,
                'duree_unite'    => 'jours',
                'quantite'       => 1.00,             // ✅ 1 gramme minimum
                'quantite_unite' => 'g (1g à 2g)',    // ✅
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 1 : Oméprazole pour Hasnae
            // Original : '20 mg' → quantite = 20.00, unite = 'mg'
            [
                'ordonnance_id'  => 1,
                'medicament_id'  => 3, // Oméprazole
                'duree'          => 4,
                'duree_unite'    => 'semaines',
                'quantite'       => 20.00,            // ✅
                'quantite_unite' => 'mg',             // ✅
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 2 : Novorapid pour Saber
            // Original : '10 unités' → quantite = 10.00, unite = 'unités (UI)'
            [
                'ordonnance_id'  => 2,
                'medicament_id'  => 4, // Novorapid
                'duree'          => 1,
                'duree_unite'    => 'mois',
                'quantite'       => 10.00,            // ✅ 10 unités d'insuline
                'quantite_unite' => 'unités (UI)',    // ✅
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 2 : Glucophage pour Saber
            // Original : '500 mg' → quantite = 500.00, unite = 'mg'
            [
                'ordonnance_id'  => 2,
                'medicament_id'  => 5, // Glucophage
                'duree'          => 4,
                'duree_unite'    => 'semaines',
                'quantite'       => 500.00,           // ✅
                'quantite_unite' => 'mg',             // ✅
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

        ]);
    }
}