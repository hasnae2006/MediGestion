<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriseMedicamentSeeder extends Seeder
{
    public function run(): void
    {
        $prises = [];
        // Dosage 1 — Gaviscon — Hasnae matin et soire 2024-05-01
        
        $start1 = '2024-05-01';
        for ($day = 0; $day < 14; $day++) {
            $date = date('Y-m-d', strtotime($start1 . " +{$day} days"));// strtotime text en nombre

            // Matin
            $prises[] = [
                'dosage_id'          => 1,
                'patient_id'         => 1,
                'temps_id'           => 1, 
                'date_prevue'        => $date,
                'heure_prevue'       => '08:00:00',
                'date_prise_reelle'  => $day < 10 ? $date : null,
                'heure_prise_reelle' => $day < 10 ? '08:05:00' : null,
                'statut'             => $day < 10 ? 'pris' : 'en_attente',
                'created_at'         => now(),
                'updated_at'         => now(),
            ];

            // Soir
            $prises[] = [
                'dosage_id'          => 1,
                'patient_id'         => 1,
                'temps_id'           => 4, 
                'date_prevue'        => $date,
                'heure_prevue'       => '20:00:00',
                'date_prise_reelle'  => $day < 9  ? $date : null,
                'heure_prise_reelle' => $day < 9  ? '20:10:00' : null,
                'statut'             => $day < 9
                    ? 'pris'
                    : ($day === 9 ? 'manque' : 'en_attente'),
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

         // Dosage 1 — Amoxicilline — Hasnae midi 2024-05-01
       
        $start2 = '2024-05-01';
        for ($day = 0; $day < 10; $day++) {
            $date = date('Y-m-d', strtotime($start2 . " +{$day} days"));

            $prises[] = [
                'dosage_id'          => 2,
                'patient_id'         => 1,
                'temps_id'           => 2, 
                'date_prevue'        => $date,
                'heure_prevue'       => '12:30:00',
                'date_prise_reelle'  => $day < 7 ? $date : null,
                'heure_prise_reelle' => $day < 7 ? '12:35:00' : null,
                'statut'             => $day < 7
                    ? 'pris'
                    : ($day === 7 ? 'manque' : 'en_attente'),
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

        //Dosage 1 — Oméprazole  — Hasnae matin 2024-05-01
        $start3 = '2024-05-01';
        for ($day = 0; $day < 28; $day++) {
            $date = date('Y-m-d', strtotime($start3 . " +{$day} days"));

            $prises[] = [
                'dosage_id'          => 3,
                'patient_id'         => 1,
                'temps_id'           => 1,
                'date_prevue'        => $date,
                'heure_prevue'       => '08:00:00',
                'date_prise_reelle'  => $day < 20 ? $date : null,
                'heure_prise_reelle' => $day < 20 ? '07:55:00' : null,
                'statut'             => $day < 20
                    ? 'pris'
                    : ($day === 20 ? 'manque' : 'en_attente'),
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

                // Dosage 4 — Novorapid  — Saber matin midi soir  2025-08-10
        $start4 = '2025-08-10';
        for ($day = 0; $day < 30; $day++) {
            $date = date('Y-m-d', strtotime($start4 . " +{$day} days"));

            $tempsNovorapid = [
                ['temps_id' => 1, 'heure' => '08:00:00', 'heure_reelle' => '07:58:00'],
                ['temps_id' => 2, 'heure' => '12:30:00', 'heure_reelle' => '12:28:00'],
                ['temps_id' => 4, 'heure' => '20:00:00', 'heure_reelle' => '20:02:00'],
            ];

            foreach ($tempsNovorapid as $t) {
                $prises[] = [
                    'dosage_id'          => 4,
                    'patient_id'         => 2,
                    'temps_id'           => $t['temps_id'],
                    'date_prevue'        => $date,
                    'heure_prevue'       => $t['heure'],
                    'date_prise_reelle'  => $day < 15 ? $date : null,
                    'heure_prise_reelle' => $day < 15 ? $t['heure_reelle'] : null,
                    'statut'             => $day < 15
                        ? 'pris'
                        : ($day === 15 ? 'manque' : 'en_attente'),
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ];
            }
        }
        // Dosage 5 — Glucophage — Saber midi  2025-08-10
        $start5 = '2025-08-10';
        for ($day = 0; $day < 28; $day++) {
            $date = date('Y-m-d', strtotime($start5 . " +{$day} days"));

            $prises[] = [
                'dosage_id'          => 5,
                'patient_id'         => 2,
                'temps_id'           => 2, 
                'date_prevue'        => $date,
                'heure_prevue'       => '12:30:00',
                'date_prise_reelle'  => $day < 18 ? $date : null,
                'heure_prise_reelle' => $day < 18 ? '12:32:00' : null,
                'statut'             => $day < 18
                    ? 'pris'
                    : ($day === 18 ? 'manque' : 'en_attente'),
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

        DB::table('prise_medicaments')->insert($prises);
    }
}
