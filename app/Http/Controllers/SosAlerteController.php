<?php

namespace App\Http\Controllers;

use App\Models\SosAlerte;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SosAlerteController extends Controller
{
    /** Liste des alertes pour le responsable connecté */
   public function index()
{
    $responsable = auth()->user();

    $alertes = SosAlerte::with('patient.user')
        ->where('responsable_id', $responsable->id)
        ->latest()
        ->get()
        ->map(fn($a) => [
            'id'      => $a->id,
            'patient' => $a->patient->nomComplet(),
            'message' => $a->message,
            'statut'  => $a->statut,
            'date'    => $a->created_at->diffForHumans(),
        ]);

    $patients = $responsable->patientsGeres()
        ->with('user')
        ->wherePivot('actif', true)
        ->get()
        ->map(fn($p) => [
            'id'     => $p->id,
            'nom'    => $p->user->nom,
            'prenom' => $p->user->prenom,
        ]);

    return Inertia::render('Responsable/Alertes', compact('alertes', 'patients'));
}
    /** Afficher le formulaire SOS pour le patient */  // ← ICI
    public function create()
    {
        return Inertia::render('Patient/Sos');
    }


    /** Patient envoie une alerte SOS */
    public function store(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $patient      = auth()->user()->patient;
        $responsable  = $patient->responsableActif();

        if (! $responsable) {
            return redirect()->back()->withErrors(['message' => 'Aucun responsable actif trouvé.']);
        }

        SosAlerte::create([
            'patient_id'     => $patient->id,
            'responsable_id' => $responsable->id,
            'message'        => $data['message'],
            'statut'         => 'envoye',
        ]);

        // Notification au responsable
        \App\Models\Notification::create([
            'user_id' => $responsable->id,
            'type'    => 'alerte',
            'titre'   => '🆘 Alerte SOS — ' . $patient->nomComplet(),
            'message' => $data['message'],
            'data'    => ['patient_id' => $patient->id],
        ]);

        return redirect()->back()->with('success', 'Alerte SOS envoyée.');
    }

    /** Responsable marque comme lu / traité */
    public function update(Request $request, SosAlerte $sosAlerte)
    {
        $data = $request->validate([
            'statut' => 'required|in:lu,traite',
        ]);

        $sosAlerte->update($data);

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }
}
