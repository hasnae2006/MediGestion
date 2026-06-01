<?php

namespace App\Http\Controllers;

use App\Models\Medecin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedecinController extends Controller
{
    public function index()
    {
        $medecins = Medecin::withCount('patients')->orderBy('nom')->get();
        return Inertia::render('Responsable/Medecins', compact('medecins'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'specialite' => 'required|string|max:150',
            'telephone'  => 'required|string|max:20',
            'email'      => 'required|email|unique:medecins,email',
        ]);
        Medecin::create($data);
        return redirect()->back()->with('success', 'Médecin ajouté.');
    }

    public function update(Request $request, Medecin $medecin)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'specialite' => 'required|string|max:150',
            'telephone'  => 'required|string|max:20',
            'email'      => 'required|email|unique:medecins,email,' . $medecin->id,
        ]);
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