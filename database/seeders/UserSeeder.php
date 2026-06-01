<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;  // ← missing

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'nom'        => 'Bahji',
                'prenom'     => 'Douae',
                'telephone'  => '0604054802',
                'email'      => 'douae.bahji@gmail.com',
                'role'       => 'responsable',
                'password'   => Hash::make('douae1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom'        => 'Lazaar',
                'prenom'     => 'Fatine',
                'telephone'  => '0657985581',
                'email'      => 'fatine.lazaar@gmail.com',
                'role'       => 'responsable',
                'password'   => Hash::make('fatine1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom'        => 'Tanane',
                'prenom'     => 'Hasnae',
                'telephone'  => '0702630476',
                'email'      => 'hasnae.tanane@gmail.com',
                'role'       => 'patient',
                'password'   => Hash::make('hasnae1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom'        => 'Nadah',
                'prenom'     => 'Saber',
                'telephone'  => '077493104',
                'email'      => 'saber.nadah@gmail.com',
                'role'       => 'patient',
                'password'   => Hash::make('nadah1234'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}