<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Medecin;
use App\Models\Notification;
use App\Models\Patient;
use App\Models\PriseMedicament;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index()
    {
        $patients = auth()->user()
            ->patientsGeres()
            ->with(['user', 'medecin'])
            ->wherePivot('actif', true)
            ->latest('patients.created_at')
            ->get()
            ->map(fn ($patient) => [
                'id'             => $patient->id,
                'nom'            => $patient->user?->nom,
                'prenom'         => $patient->user?->prenom,
                'email'          => $patient->user?->email,
                'telephone'      => $patient->user?->telephone,
                'lien'           => $patient->lien,
                'etat'           => $patient->etat,
                'adresse'        => $patient->adresse,
                'date_naissance' => $patient->date_naissance?->format('Y-m-d'),
                'adherence'      => $patient->tauxAdherence(),
                'medecin_id'     => $patient->medecin_id,
                'medecin'        => $patient->medecin ? [
                    'id'         => $patient->medecin->id,
                    'nom'        => $patient->medecin->nom,
                    'prenom'     => $patient->medecin->prenom,
                    'specialite' => $patient->medecin->specialite,
                    'telephone'  => $patient->medecin->telephone,
                ] : null,
            ]);

        $medecins = Medecin::orderBy('nom')->get();

        return Inertia::render('Responsable/Patients', compact('patients', 'medecins'));
    }

    public function store(StorePatientRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'nom'       => $data['nom'],
            'prenom'    => $data['prenom'],
            'email'     => $data['email'],
            'telephone' => $data['telephone'],
            'role'      => 'patient',
            'password'  => Hash::make($data['password']),
        ]);

        $patient = Patient::create([
            'user_id'        => $user->id,
            'lien'           => $data['lien'],
            'etat'           => 'actif',
            'adresse'        => $data['adresse'] ?? null,
            'date_naissance' => $data['date_naissance'] ?? null,
            'medecin_id'     => $data['medecin_id'] ?? null,
        ]);

        auth()->user()->patientsGeres()->syncWithoutDetaching([
            $patient->id => [
                'date_debut' => now()->toDateString(),
                'actif'      => true,
            ],
        ]);

        return redirect()->back()->with('success', 'Patient ajoute avec succes.');
    }

    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $this->authorizeManagedPatient($patient);

        $data = $request->validated();

        $patient->user?->update([
            'nom'       => $data['nom'],
            'prenom'    => $data['prenom'],
            'email'     => $data['email'],
            'telephone' => $data['telephone'],
        ]);

        $patient->update([
            'lien'           => $data['lien'],
            'etat'           => $data['etat'],
            'adresse'        => $data['adresse'] ?? null,
            'date_naissance' => $data['date_naissance'] ?? null,
            'medecin_id'     => $data['medecin_id'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Patient mis a jour.');
    }

    public function destroy(Patient $patient)
    {
        $this->authorizeManagedPatient($patient);

        auth()->user()->patientsGeres()->updateExistingPivot($patient->id, [
            'date_fin' => now()->toDateString(),
            'actif' => false,
        ]);

        return redirect()->back()->with('success', 'Patient retire de votre liste.');
    }

    public function sendProgramme(Patient $patient)
    {
        $this->authorizeManagedPatient($patient);

        $prises = PriseMedicament::with(['dosage.medicament', 'temps'])
            ->where('patient_id', $patient->id)
            ->whereDate('date_prevue', today())
            ->orderBy('heure_prevue')
            ->get();

        $message = $prises->isEmpty()
            ? "Aucune prise prevue aujourd'hui."
            : $prises->map(function (PriseMedicament $prise) {
                $heure = substr((string) $prise->heure_prevue, 0, 5);
                $medicament = $prise->dosage?->medicament?->nom_commercial ?? 'Medicament';
                $quantite = trim(($prise->dosage?->quantite ?? '') . ' ' . ($prise->dosage?->quantite_unite ?? ''));
                $temps = $prise->temps?->nom ? " ({$prise->temps->nom})" : '';

                return trim("{$heure} - {$medicament} {$quantite}{$temps}");
            })->implode("\n");

        Notification::create([
            'user_id' => $patient->user_id,
            'type' => 'rappel',
            'titre' => 'Programme du jour',
            'message' => $message,
            'data' => [
                'patient_id' => $patient->id,
                'date' => today()->toDateString(),
            ],
        ]);

        return redirect()->back()->with('success', 'Programme du jour envoye au patient.');
    }

    private function authorizeManagedPatient(Patient $patient): void
    {
        $isManaged = auth()->user()
            ->patientsGeres()
            ->where('patients.id', $patient->id)
            ->wherePivot('actif', true)
            ->exists();

        abort_unless($isManaged, 403);
    }
}
