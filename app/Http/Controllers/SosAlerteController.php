<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSosAlerteRequest;
use App\Http\Requests\UpdateSosAlerteRequest;
use App\Models\SosAlerte;
use App\Models\Notification;
use App\Models\PriseMedicament;
use Inertia\Inertia;

class SosAlerteController extends Controller
{
    // Liste des alertes pour le responsable connecté 
    public function index()
    {
        $responsable = auth()->user();

        $alertesSos = SosAlerte::with('patient.user')
            ->where('responsable_id', $responsable->id)
            ->latest()
            ->get()
            ->map(fn($a) => [
                'id'      => $a->id,
                'source'  => 'sos',
                'patient' => $a->patient->nomComplet(),
                'message' => $a->message,
                'statut'  => $a->statut,
                'date'    => $a->created_at->diffForHumans(),
            ]);

        $patientsCollection = $responsable->patientsGeres()
            ->with('user')
            ->wherePivot('actif', true)
            ->get();

        $patientIds = $patientsCollection->pluck('id');

        PriseMedicament::whereIn('patient_id', $patientIds)
            ->whereDate('date_prevue', today())
            ->where('heure_prevue', '<', now()->format('H:i:s'))
            ->where('statut', 'en_attente')
            ->update(['statut' => 'manque']);

        $alertesPrises = PriseMedicament::with(['patient.user', 'dosage.medicament'])
            ->whereIn('patient_id', $patientIds)
            ->whereDate('date_prevue', today())
            ->where('statut', 'manque')
            ->orderByDesc('heure_prevue')
            ->get()
            ->map(fn($prise) => [
                'id'      => 'prise-'.$prise->id,
                'source'  => 'prise',
                'patient' => $prise->patient->nomComplet(),
                'message' => 'Prise manquee: '.$prise->dosage->medicament->nom_commercial.' a '.substr((string) $prise->heure_prevue, 0, 5),
                'statut'  => 'envoye',
                'date'    => "Aujourd'hui",
            ]);

        $alertes = $alertesSos->concat($alertesPrises)->values();

        $patients = $patientsCollection
            ->map(fn($p) => [
                'id'     => $p->id,
                'nom'    => $p->user->nom,
                'prenom' => $p->user->prenom,
            ]);

        return Inertia::render('Responsable/Alertes', compact('alertes', 'patients'));
    }

    /** Afficher le formulaire SOS pour le patient */
    public function create()
    {
        $patient = auth()->user()->patient;
        $medecin = $patient?->medecin;
        
        return Inertia::render('Patient/Sos', [
            'medecin' => $medecin ? [
                'id'         => $medecin->id,
                'nom'        => $medecin->nom,
                'prenom'     => $medecin->prenom,
                'specialite' => $medecin->specialite,
                'telephone'  => $medecin->telephone,
            ] : null,
        ]);
    }

    /** Patient envoie une alerte SOS */
    public function store(StoreSosAlerteRequest $request)
    {
        try {
            $data = $request->validated();

            $patient = auth()->user()->patient;
            
            if (!$patient) {
                return redirect()->back()->withErrors(['error' => 'Patient non trouvé.']);
            }

            $responsable = $patient->responsableActif();

            if (!$responsable) {
                return redirect()->back()->withErrors(['error' => 'Aucun responsable actif trouvé. Veuillez contacter votre administrateur.']);
            }
            $sosAlerte = SosAlerte::create([
                'patient_id'     => $patient->id,
                'responsable_id' => $responsable->id,
                'message'        => $data['message'],
                'statut'         => 'envoye',
            ]);
            Notification::create([
                'user_id' => $responsable->id,
                'type'    => 'alerte',
                'titre'   => '🆘 ALERTE SOS - ' . $patient->nomComplet(),
                'message' => $data['message'],
                'lu'      => false,
                'data'    => [
                    'patient_id' => $patient->id,
                    'sos_alerte_id' => $sosAlerte->id
                ],
            ]);
            return redirect()->back()->with([
                'success' => 'Alerte SOS envoyée avec succès à votre responsable.',
                'sos_sent' => true
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi SOS: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Une erreur est survenue. Veuillez réessayer.']);
        }
    }
    public function update(UpdateSosAlerteRequest $request, SosAlerte $sosAlerte)
    {
        abort_unless($sosAlerte->responsable_id === auth()->id(), 403);

        $data = $request->validated();

        $sosAlerte->update($data);

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }
}
