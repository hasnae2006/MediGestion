<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        ]);

        return Inertia::render('Responsable/Medicaments', compact('medicaments'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom_commercial' => 'required|string|max:200',
            'forme'          => 'required|in:comprime,sirop,injectable,capsule,autre',
            'quantite_stock' => 'required|integer|min:0',
        ]);

        Medicament::create($data);

        return redirect()->back()->with('success', 'Médicament ajouté.');
    }

    public function update(Request $request, Medicament $medicament)
    {
        $data = $request->validate([
            'nom_commercial' => 'required|string|max:200',
            'forme'          => 'required|in:comprime,sirop,injectable,capsule,autre',
            'quantite_stock' => 'required|integer|min:0',
        ]);

        $medicament->update($data);

        return redirect()->back()->with('success', 'Médicament mis à jour.');
    }

    public function destroy(Medicament $medicament)
    {
        $medicament->delete();

        return redirect()->back()->with('success', 'Médicament supprimé.');
    }

    /** PATCH /medicaments/{id}/stock — Réapprovisionner */
    public function reapprovisionner(Request $request, Medicament $medicament)
    {
        $data = $request->validate([
            'quantite' => 'required|integer|min:1',
        ]);

        $medicament->increment('quantite_stock', $data['quantite']);

        return redirect()->back()->with('success', 'Stock mis à jour.');
    }
}
