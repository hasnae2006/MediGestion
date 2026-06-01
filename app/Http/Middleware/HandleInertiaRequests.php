<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
       // return [
           // ...parent::share($request),
            //'auth' => [
           //     'user' => $request->user(),
          //  ],
       // ];

        $user = $request->user();

        return array_merge(parent::share($request), [
            // Infos utilisateur courant
            'auth' => [
                'user' => $user ? [
                    'id'     => $user->id,
                    'nom'    => $user->nom,
                    'prenom' => $user->prenom,
                    'email'  => $user->email,
                    'role'   => $user->role,
                ] : null,
            ],

            // Flash messages (Toast dans React)
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],

            // Compteur de notifications non lues
            'notificationsCount' => $user
                ? $user->notifications()->where('lu', false)->count()
                : 0,

            // Compteur alertes SOS non traitées (responsable seulement)
            'alertesCount' => $user && $user->isResponsable()
                ? \App\Models\SosAlerte::where('responsable_id', $user->id)
                    ->whereIn('statut', ['envoye', 'lu'])
                    ->count()
                : 0,
        ]);
    
    }
}
