<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;  // ← missing

class MedicamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $medicaments = [
            [
                'nom_commercial'  => 'Gaviscon 10 à 20 ml', // stomch
                'forme'           => 'sirop',
                'photo_boite'     => null,
                'quantite_stock'  => 100,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
             [
                'nom_commercial'  => 'Amoxicilline 5ml', // les stomach
                'forme'           => 'sirop',
                'photo_boite'     => null,
                'quantite_stock'  => 50,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

             [
                'nom_commercial'  => 'Oméprazole 20mg', // les stomach
                'forme'           => 'capsule',
                'photo_boite'     => null,
                'quantite_stock'  => 120,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'nom_commercial'  => 'Glucophage 850mg', //diabetes
                'forme'           => 'comprime',
                'photo_boite'     => null,
                'quantite_stock'  => 200,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'nom_commercial'  => 'Novorapid 100Ul/ml', //diabetes
                'forme'           => 'injectable',
                'photo_boite'     => null,
                'quantite_stock'  => 150,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            
            
        ];

        DB::table('medicaments')->insert($medicaments);
    }
}
