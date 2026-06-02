<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicamentRequest;
use App\Http\Requests\ReapprovisionnerMedicamentRequest;
use App\Models\Medicament;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MedicamentController extends Controller
{
    public function index()
    {
        $medicaments = Medicament::orderBy('nom_commercial')->get()->map(fn($m) => [
            'id'             => $m->id,
            'nom_commercial' => $m->nom_commercial,
            'forme'          => $m->forme,
            'quantite_stock' => $m->quantite_stock,
            'stock_faible'   => $m->stockFaible(),
            'photo_boite'    => $m->photo_boite,
        ]);

        return Inertia::render('Responsable/Medicaments', compact('medicaments'));
    }

    public function store(MedicamentRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('photo_boite')) {
            $data['photo_boite'] = $request->file('photo_boite')
                ->store('medicaments', 'public');
        }

        Medicament::create($data);

        return redirect()->back()->with('success', 'Médicament ajouté.');
    }

    public function update(MedicamentRequest $request, Medicament $medicament)
    {
        $data = $request->validated();

        if ($request->hasFile('photo_boite')) {
            if ($medicament->photo_boite) {
                Storage::disk('public')->delete($medicament->photo_boite);
            }
            $data['photo_boite'] = $request->file('photo_boite')
                ->store('medicaments', 'public');
        }

        $medicament->update($data);

        return redirect()->back()->with('success', 'Médicament mis à jour.');
    }

    public function destroy(Medicament $medicament)
    {
        if ($medicament->photo_boite) {
            Storage::disk('public')->delete($medicament->photo_boite);
        }

        $medicament->delete();

        return redirect()->back()->with('success', 'Médicament supprimé.');
    }

    // PATCH /medicaments/{id}/stock — Réapprovisionner 
    public function reapprovisionner(ReapprovisionnerMedicamentRequest $request, Medicament $medicament)
    {
        $data = $request->validated();
        $medicament->increment('quantite_stock', $data['quantite']);

        return redirect()->back()->with('success', 'Stock mis à jour.');
    }
}
