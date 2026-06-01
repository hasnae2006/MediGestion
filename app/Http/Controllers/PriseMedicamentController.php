<?php

namespace App\Http\Controllers;

use App\Models\PriseMedicament;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PriseMedicamentController extends Controller
{
    /** Programme du jour du patient connecté */
  public function index()
{
    $patient = auth()->user()->patient;
    $patient->load('medecin');

    $prises = PriseMedicament::with(['dosage.medicament', 'temps'])
        ->where('patient_id', $patient->id)
        ->whereDate('date_prevue', today())
        ->orderBy('heure_prevue')
        ->get()
        ->map(fn($p) => [
            'id'            => $p->id,
            'medicament'    => $p->dosage->medicament->nom_commercial,
            'forme'         => $p->dosage->medicament->forme,
            'photo_boite'   => $p->dosage->medicament->photo_boite,
            'quantite'      => $p->dosage->quantite . ' ' . $p->dosage->quantite_unite,
            'temps'         => $p->temps->nom,
            'heure_prevue'  => substr($p->heure_prevue, 0, 5),
            'statut'        => $p->statut,
        ]);

    $adherence = $patient->tauxAdherence();

    $medecin = $patient->medecin ? [
        'nom'        => $patient->medecin->nom,
        'prenom'     => $patient->medecin->prenom,
        'specialite' => $patient->medecin->specialite,
        'telephone'  => $patient->medecin->telephone,
    ] : null;

    $prochainePrise = $prises->firstWhere('statut', 'en_attente');

    return Inertia::render('Patient/Dashboard', compact('prises', 'adherence', 'medecin', 'prochainePrise'));
}

    /** Patient confirme une prise */
    public function confirmer(PriseMedicament $prise)
    {
        abort_unless($prise->patient_id === auth()->user()->patient?->id, 403);

        $prise->confirmer();

        // Diminuer le stock du médicament
        $medicament = $prise->dosage->medicament;
        $medicament->decrement('quantite_stock');

        // Notification de confirmation
        \App\Models\Notification::create([
            'user_id' => auth()->id(),
            'type'    => 'confirmation',
            'titre'   => 'Prise confirmée ✅',
            'message' => "Prise de {$medicament->nom_commercial} à {$prise->heure_prevue} confirmée.",
            'data'    => ['prise_id' => $prise->id],
        ]);

        return redirect()->back()->with('success', 'Prise confirmée !');
    }

    /** Responsable — historique de toutes les prises de ses patients */
    public function historique()
    {
        $responsable = auth()->user();
        $patientIds  = $responsable->patientsGeres()->pluck('patients.id');

        $prises = PriseMedicament::with(['dosage.medicament', 'patient.user', 'temps'])
            ->whereIn('patient_id', $patientIds)
            ->orderByDesc('date_prevue')
            ->paginate(50)
            ->through(fn($p) => [
                'patient'        => $p->patient->nomComplet(),
                'medicament'     => $p->dosage->medicament->nom_commercial,
                'date'           => $p->date_prevue->format('d/m/Y'),
                'heure'          => substr($p->heure_prevue, 0, 5),
                'statut'         => $p->statut,
                'heure_reelle'   => $p->heure_prise_reelle ? substr($p->heure_prise_reelle, 0, 5) : null,
            ]);

        return Inertia::render('Responsable/Historique', compact('prises'));
    }
}
