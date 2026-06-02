<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;


class ResponsableController extends Controller
{
    public function profil()
{
    return Inertia::render('Responsable/Profil', [
        'profil' => auth()->user(),
    ]);
}
    public function updateProfil(Request $request)
{
    $rules = [
        'prenom'    => 'required|string|max:255',
        'nom'       => 'required|string|max:255',
        'email'     => 'required|email|unique:users,email,' . auth()->id(),
        'telephone' => 'nullable|string|max:20',
    ];

    if ($request->filled('password')) {
        $rules['password'] = 'min:8|confirmed';
    }

    $request->validate($rules);

    $data = $request->only('prenom', 'nom', 'email', 'telephone');
    if ($request->filled('password')) {
        $data['password'] = bcrypt($request->password);
    }

    auth()->user()->update($data);

    return back()->with('success', 'Profil mis à jour.');
}
}
