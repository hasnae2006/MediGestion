<?php

namespace App\Http\Controllers;

use App\Models\PriseMedicament;
use App\Models\Medicament;
use App\Models\SosAlerte;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /** Dashboard Responsable */
    public function responsable()
    {
        $responsable = auth()->user();
        $patientIds  = $responsable->patientsGeres()->wherePivot('actif', true)->pluck('patients.id');

        $stats = [
            'patients'          => $patientIds->count(),
            'ordonnances_actives'=> \App\Models\Ordonnance::where('responsable_id', $responsable->id)->where('active', true)->count(),
            'alertes_non_traitees'=> SosAlerte::whereIn('patient_id', $patientIds)->whereIn('statut', ['envoye', 'lu'])->count(),
            'stock_total'       => Medicament::sum('quantite_stock'),
        ];

        // Suivi adhérence globale
        $totalPrises = PriseMedicament::whereIn('patient_id', $patientIds)
            ->where('date_prevue', '>=', now()->subDays(30))
            ->whereIn('statut', ['pris', 'manque'])->count();

        $prisesConfirmees = PriseMedicament::whereIn('patient_id', $patientIds)
            ->where('date_prevue', '>=', now()->subDays(30))
            ->where('statut', 'pris')->count();

        $adherence = $totalPrises > 0 ? round($prisesConfirmees * 100 / $totalPrises) : 0;

        // Prises manquées aujourd'hui
        $alertes = PriseMedicament::with(['dosage.medicament', 'patient.user'])
            ->whereIn('patient_id', $patientIds)
            ->whereDate('date_prevue', today())
            ->where('statut', 'manque')
            ->get()
            ->map(fn($p) => [
                'patient'    => $p->patient->nomComplet(),
                'medicament' => $p->dosage->medicament->nom_commercial,
                'heure'      => substr($p->heure_prevue, 0, 5),
            ]);

        // Stock faible (seuil 10)
        $stockFaible = Medicament::where('quantite_stock', '<=', 10)
            ->orderBy('quantite_stock')
            ->get(['nom_commercial', 'quantite_stock']);

        // Ordonnances actives récentes
        $ordonnances = \App\Models\Ordonnance::with(['patient.user', 'dosages.medicament'])
            ->where('responsable_id', $responsable->id)
            ->where('active', true)
            ->latest('date_prescription')
            ->take(5)
            ->get()
            ->map(fn($o) => [
                'patient'     => $o->patient->nomComplet(),
                'medecin'     => $o->nom_medecin,
                'date'        => $o->date_prescription->format('d/m/Y'),
                'medicaments' => $o->dosages->pluck('medicament.nom_commercial')->implode(', '),
            ]);

        return Inertia::render('Responsable/Dashboard', compact('stats', 'adherence', 'alertes', 'stockFaible', 'ordonnances'));
    }
}
