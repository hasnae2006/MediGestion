<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user    = auth()->user();
        $patient = $user->patient;

        return Inertia::render('Patient/Profil', [
            'profil' => [
                'nom'            => $user->nom,
                'prenom'         => $user->prenom,
                'email'          => $user->email,
                'telephone'      => $user->telephone ?? null,
                'date_naissance' => $patient->date_naissance
                    ? \Carbon\Carbon::parse($patient->date_naissance)->format('d/m/Y')
                    : null,
                'lien'           => $patient->lien,
                'etat'           => $patient->etat,
                 'adresse' => $patient->adresse ?? null,
                'responsable'    => $patient->responsableActif()
                    ? $patient->responsableActif()->nom . ' ' . $patient->responsableActif()->prenom
                    : 'Aucun',
            ],
        ]);
    }
}