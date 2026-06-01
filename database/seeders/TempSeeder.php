<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;  // ← missing


class TempSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $temps = [
            ['nom' => 'Matin',       'heure' => '08:00:00'],
            ['nom' => 'Midi',        'heure' => '12:30:00'],
            ['nom' => 'Après-midi',  'heure' => '16:00:00'],
            ['nom' => 'Soir',        'heure' => '20:00:00'],
            ['nom' => 'Nuit',        'heure' => '22:00:00'],
        ];

        DB::table('temps')->insert($temps);
    }
}
