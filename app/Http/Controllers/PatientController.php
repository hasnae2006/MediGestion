<?php
namespace App\Http\Controllers;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Medecin;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index()
    {
        $responsable = auth()->user();
        $patients = $responsable->patientsGeres()
            ->with(['user', 'medecin'])
            ->wherePivot('actif', true)
            ->get()
            ->map(fn($p) => [
                'id'             => $p->id,
                'nom'            => $p->user->nom,
                'prenom'         => $p->user->prenom,
                'email'          => $p->user->email,
                'telephone'      => $p->user->telephone,
                'lien'           => $p->lien,
                'etat'           => $p->etat,
                'date_naissance' => $p->date_naissance?->format('Y-m-d'),
                'adherence'      => $p->tauxAdherence(),
                'medecin_id'     => $p->medecin_id,
                'medecin'        => $p->medecin ? [
                    'id'         => $p->medecin->id,
                    'nom'        => $p->medecin->nom,
                    'prenom'     => $p->medecin->prenom,
                    'specialite' => $p->medecin->specialite,
                    'telephone'  => $p->medecin->telephone,
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
            'date_naissance' => $data['date_naissance'] ?? null,
            'etat'           => 'actif',
            'medecin_id'     => $data['medecin_id'] ?? null,
        ]);

        auth()->user()->patientsGeres()->attach($patient->id, [
            'date_debut' => now()->toDateString(),
            'actif'      => true,
        ]);

        return redirect()->back()->with('success', 'Patient ajouté avec succès.');
    }

    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $data = $request->validated();

        $patient->user->update([
            'nom'       => $data['nom'],
            'prenom'    => $data['prenom'],
            'email'     => $data['email'],
            'telephone' => $data['telephone'],
        ]);

        $patient->update([
            'lien'           => $data['lien'],
            'etat'           => $data['etat'],
            'date_naissance' => $data['date_naissance'] ?? null,
            'medecin_id'     => $data['medecin_id'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Patient mis à jour.');
    }

    public function destroy(Patient $patient)
    {
        auth()->user()->patientsGeres()->updateExistingPivot($patient->id, [
            'actif'    => false,
            'date_fin' => now()->toDateString(),
        ]);
        return redirect()->back()->with('success', 'Patient retiré de votre liste.');
    }
}
