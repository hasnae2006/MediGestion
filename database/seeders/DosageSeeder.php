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
            [
                'ordonnance_id'  => 1,
                'medicament_id'  => 1, // Gaviscon
                'duree'          => 14,
                'duree_unite'    => 'jours',
                'quantite'       => 10.00,           
                'quantite_unite' => 'ml (10 à 20 ml)',  
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 1 : Amoxicilline pour Hasnae
            [
                'ordonnance_id'  => 1,
                'medicament_id'  => 2, 
                'duree'          => 10,
                'duree_unite'    => 'jours',
                'quantite'       => 1.00,             
                'quantite_unite' => 'g (1g à 2g)',    
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 1 : Oméprazole pour Hasnae
            [
                'ordonnance_id'  => 1,
                'medicament_id'  => 3, // Oméprazole
                'duree'          => 4,
                'duree_unite'    => 'semaines',
                'quantite'       => 20.00,            
                'quantite_unite' => 'mg',             
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 2 : Novorapid pour Saber
            [
                'ordonnance_id'  => 2,
                'medicament_id'  => 4, 
                'duree'          => 1,
                'duree_unite'    => 'mois',
                'quantite'       => 10.00,            
                'quantite_unite' => 'unités (UI)',    
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

            // ── Ordonnance 2 : Glucophage pour Saber
            [
                'ordonnance_id'  => 2,
                'medicament_id'  => 5, 
                'duree'          => 4,
                'duree_unite'    => 'semaines',
                'quantite'       => 500.00,           
                'created_at'     => now(),
                'updated_at'     => now(),
            ],

        ]);
    }
}