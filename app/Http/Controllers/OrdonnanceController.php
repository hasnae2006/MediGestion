<?php

namespace App\Http\Controllers;

use App\Models\Ordonnance;
use App\Models\Dosage;
use App\Models\Patient;
use App\Models\Medicament;
use App\Models\Temp;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrdonnanceController extends Controller
{
    public function index()
    {
        $responsable = auth()->user();

        $ordonnances = Ordonnance::with(['patient.user', 'dosages.medicament'])
            ->where('responsable_id', $responsable->id)
            ->latest('date_prescription')
            ->get()
            ->map(fn($o) => [
                'id'               => $o->id,
                'patient_id'       => $o->patient_id,
                'patient'          => $o->patient->nomComplet(),
                'nom_medecin'      => $o->nom_medecin,
                'date_prescription'=> $o->date_prescription->format('d/m/Y'),
                 'date_prescription_raw' => $o->date_prescription->format('Y-m-d'), // ← ajoutez ça
                'active'           => $o->active,
                'medicaments'      => $o->dosages->map(fn($d) => [
                    'nom'     => $d->medicament->nom_commercial,
                    'quantite'=> $d->quantite,
                    'unite'   => $d->quantite_unite,
                    'duree'   => "{$d->duree} {$d->duree_unite}",
                ]),
            ]);

        $patients    = $responsable->patientsGeres()->with('user')->wherePivot('actif', true)->get();
        $medicaments = Medicament::orderBy('nom_commercial')->get();
        $temps       = Temp::all();

        return Inertia::render('Responsable/Ordonnances', compact('ordonnances', 'patients', 'medicaments', 'temps'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_id'        => 'required|exists:patients,id',
            'nom_medecin'       => 'nullable|string|max:100',
            'date_prescription' => 'required|date',
            'dosages'           => 'required|array|min:1',
            'dosages.*.medicament_id' => 'required|exists:medicaments,id',
            'dosages.*.duree'         => 'required|integer|min:1',
            'dosages.*.duree_unite'   => 'required|in:jours,semaines,mois',
            'dosages.*.quantite'      => 'required|string',
            'dosages.*.quantite_unite'=> 'required|string',
            'dosages.*.temps_ids'     => 'required|array|min:1',
        ]);

        $ordonnance = Ordonnance::create([
            'patient_id'        => $data['patient_id'],
            'responsable_id'    => auth()->id(),
            'nom_medecin'       => $data['nom_medecin'],
            'date_prescription' => $data['date_prescription'],
            'active'            => true,
        ]);

        foreach ($data['dosages'] as $d) {
            $dosage = Dosage::create([
                'ordonnance_id'  => $ordonnance->id,
                'medicament_id'  => $d['medicament_id'],
                'duree'          => $d['duree'],
                'duree_unite'    => $d['duree_unite'],
                'quantite'       => $d['quantite'],
                'quantite_unite' => $d['quantite_unite'],
            ]);

            // Générer automatiquement toutes les prises prévues
            $dosage->setRelation('ordonnance', $ordonnance);
            $dosage->genererPrises($d['temps_ids']);
        }

        return redirect()->back()->with('success', 'Ordonnance créée et prises générées.');
    }

    public function update(Request $request, Ordonnance $ordonnance)
    {
        $data = $request->validate([
            'nom_medecin'       => 'nullable|string|max:100',
           'date_prescription' => 'required|date_format:Y-m-d', // ← format explicite
            'active'            => 'required|boolean',
        ]);

        $ordonnance->update($data);

        return redirect()->back()->with('success', 'Ordonnance mise à jour.');
    }

    public function destroy(Ordonnance $ordonnance)
    {
        // Supprimer aussi les prises liées (cascade via dosages)
        $ordonnance->delete();

        return redirect()->back()->with('success', 'Ordonnance supprimée.');
    }
}
