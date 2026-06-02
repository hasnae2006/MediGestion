<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'responsables' => User::responsables()
                ->orderBy('nom')
                ->get(['id', 'nom', 'prenom']),
        ]);
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'telephone' => $data['telephone'],
                'email' => $data['email'],
                'role' => $data['role'],
                'password' => Hash::make($data['password']),
            ]);

            if ($user->role === 'patient') {
                $patient = Patient::create([
                    'user_id' => $user->id,
                    'date_naissance' => $data['date_naissance'],
                    'photo' => null,
                    'lien' => $data['lien'],
                    'etat' => 'actif',
                    'adresse' => $data['adresse'],
                ]);

                $patient->responsables()->attach($data['responsable_id'], [
                    'date_debut' => now()->toDateString(),
                    'date_fin' => null,
                    'actif' => true,
                ]);
            }

            return $user;
        });

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route($user->role . '.dashboard');
    }
}
