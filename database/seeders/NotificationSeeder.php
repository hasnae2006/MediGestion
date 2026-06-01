<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $notifExemples = [
            ['type' => 'rappel',       'titre' => 'Rappel Gaviscon matin',    'message' => 'Heure de prendre Gaviscon 10 à 20ml.',                  'lu' => false],
            ['type' => 'confirmation', 'titre' => 'Prise confirmée',          'message' => 'Prise de 08h00 de Amoxicilline 5ml confirmée.',         'lu' => true],
            ['type' => 'alerte',       'titre' => 'Prise manquée',            'message' => 'Oméprazole 20mg 12h00 manquée.',                        'lu' => false],
            ['type' => 'info',         'titre' => 'Nouvelle ordonnance',      'message' => 'Une ordonnance a été activée par votre responsable.',   'lu' => true],
            ['type' => 'alerte',       'titre' => 'Stock faible',             'message' => 'Glucophage 850mg : seulement 4 restants.',              'lu' => false],
        ];

        // user_id 1 = Douae (Responsable)
        // user_id 2 = Fatine (Responsable)
        // user_id 3 = Hasnae (Patient)
        // user_id 4 = Saber (Patient)
        $userIds = [1, 2, 3, 4];

        $rows = [];
        foreach ($userIds as $userId) {
            foreach ($notifExemples as $n) {
                $rows[] = [
                    'user_id'    => $userId,
                    'type'       => $n['type'],
                    'titre'      => $n['titre'],
                    'message'    => $n['message'],
                    'data'       => json_encode(['user_id' => $userId]),
                    'lu'         => $n['lu'],
                    'lu_at'      => $n['lu'] ? now()->subHours(rand(1, 24)) : null,
                    'created_at' => now()->subMinutes(rand(10, 1440)),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('notifications')->insert($rows);
    }
}