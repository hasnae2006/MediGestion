<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;  // ← missing

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('patients')->insert([
            [
                'user_id'        => 3,
                'date_naissance' => '1998-07-09',
                'photo'          => null,
                'lien'           => 'infirmier',
                'etat'           => 'actif',
                'adresse'       =>'Hay EL WAHDA BENSOUDA FES NR 29',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'user_id'        => 4,
                'date_naissance' => '1973-07-18',
                'photo'          => null,
                'lien'           => 'soeur',
                'etat'           => 'actif',
                'adresse'       =>'AIN CHEKF FES  NR 63',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}