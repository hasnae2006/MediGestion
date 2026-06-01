<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;  // ← missing


class OrdonnanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('ordonnances')->insert([
            [
                'patient_id'       => 1,
                'responsable_id'   => 1,
                'date_prescription'=> '2024-05-01',
                'nom_medecin'      => 'Dr. Rachid Laraki ', // dr stomach
                'active'           => true,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'patient_id'       => 2,
                'responsable_id'   => 2,
                'date_prescription'=> '2025-08-10',
                'nom_medecin'      => 'Dr. Taleb El Houda', // dr diabete
                'active'           => true,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
        ]);
    }
}
