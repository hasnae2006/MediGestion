<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedecinRequest;
use App\Models\Medecin;
use Inertia\Inertia;

class MedecinController extends Controller
{
    public function index()
    {
        $medecins = Medecin::withCount('patients')->orderBy('nom')->get();
        return Inertia::render('Responsable/Medecins', compact('medecins'));
    }

    public function store(MedecinRequest $request)
    {
        $data = $request->validated();
        Medecin::create($data);
        return redirect()->back()->with('success', 'Médecin ajouté.');
    }

    public function update(MedecinRequest $request, Medecin $medecin)
    {
        $data = $request->validated();
        $medecin->update($data);
        return redirect()->back()->with('success', 'Médecin mis à jour.');
    }

    public function destroy(Medecin $medecin)
    {
        $medecin->delete();
        return redirect()->back()->with('success', 'Médecin supprimé.');
    }

    public function show(Medecin $medecin)
    {
        $medecin->load('patients.user');
        return Inertia::render('Responsable/MedecinDetail', [
            'medecin'  => $medecin,
            'patients' => $medecin->patients,
        ]);
    }
}
