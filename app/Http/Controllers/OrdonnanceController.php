<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrdonnanceRequest;
use App\Http\Requests\UpdateOrdonnanceRequest;
use App\Models\Dosage;
use App\Models\Medicament;
use App\Models\Ordonnance;
use App\Models\Temp;
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
            ->map(fn ($o) => [
                'id' => $o->id,
                'patient_id' => $o->patient_id,
                'patient' => $o->patient->nomComplet(),
                'nom_medecin' => $o->nom_medecin,
                'date_prescription' => $o->date_prescription->format('d/m/Y'),
                'date_prescription_raw' => $o->date_prescription->format('Y-m-d'),
                'active' => $o->active,
                'medicaments' => $o->dosages->map(fn ($d) => [
                    'nom' => $d->medicament->nom_commercial,
                    'quantite' => $d->quantite,
                    'unite' => $d->quantite_unite,
                    'duree' => "{$d->duree} {$d->duree_unite}",
                ]),
            ]);

        $patients = $responsable->patientsGeres()->with('user')->wherePivot('actif', true)->get();
        $medicaments = Medicament::orderBy('nom_commercial')->get();
        $temps = Temp::all();

        return Inertia::render('Responsable/Ordonnances', compact('ordonnances', 'patients', 'medicaments', 'temps'));
    }

    public function store(StoreOrdonnanceRequest $request)
    {
        $data = $request->validated();

        $ordonnance = Ordonnance::create([
            'patient_id' => $data['patient_id'],
            'responsable_id' => auth()->id(),
            'nom_medecin' => $data['nom_medecin'],
            'date_prescription' => $data['date_prescription'],
            'active' => true,
        ]);

        foreach ($request->normalizedDosages() as $d) {
            $dosage = Dosage::create([
                'ordonnance_id' => $ordonnance->id,
                'medicament_id' => $d['medicament_id'],
                'duree' => $d['duree'],
                'duree_unite' => $d['duree_unite'],
                'quantite' => $d['quantite'],
                'quantite_unite' => $d['quantite_unite'],
            ]);

            $dosage->setRelation('ordonnance', $ordonnance);
            $dosage->genererPrises($d['temps_ids']);
        }

        return redirect()->back()->with('success', 'Ordonnance creee et prises generees.');
    }

    public function update(UpdateOrdonnanceRequest $request, Ordonnance $ordonnance)
    {
        $ordonnance->update($request->validated());

        return redirect()->back()->with('success', 'Ordonnance mise a jour.');
    }

    public function destroy(Ordonnance $ordonnance)
    {
        $ordonnance->delete();

        return redirect()->back()->with('success', 'Ordonnance supprimee.');
    }
}
