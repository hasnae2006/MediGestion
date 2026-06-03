<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use App\Models\Ordonnance;
use App\Models\PriseMedicament;
use App\Models\SosAlerte;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function responsable(): Response
    {
        $responsable = auth()->user();
        $patientIds = $responsable->patientsGeres()
            ->wherePivot('actif', true)
            ->pluck('patients.id');

        $stats = [
            'patients' => $patientIds->count(),
            'ordonnances_actives' => Ordonnance::where('responsable_id', $responsable->id)
                ->where('active', true)
                ->count(),
            'alertes_non_traitees' => SosAlerte::whereIn('patient_id', $patientIds)
                ->whereIn('statut', ['envoye', 'lu'])
                ->count(),
            'stock_total' => Medicament::sum('quantite_stock'),
        ];

        $prisesQuery = PriseMedicament::whereIn('patient_id', $patientIds)
            ->where('date_prevue', '>=', now()->subDays(30))
            ->whereIn('statut', ['pris', 'manque']);

        $totalPrises = (clone $prisesQuery)->count();
        $prisesConfirmees = (clone $prisesQuery)->where('statut', 'pris')->count();
        $adherence = $totalPrises > 0 ? round(($prisesConfirmees * 100) / $totalPrises) : 0;

        $alertes = PriseMedicament::with(['dosage.medicament', 'patient.user'])
            ->whereIn('patient_id', $patientIds)
            ->whereDate('date_prevue', today())
            ->where('statut', 'manque')
            ->get()
            ->map(fn (PriseMedicament $prise) => [
                'patient' => $prise->patient?->nomComplet() ?? 'Patient',
                'medicament' => $prise->dosage?->medicament?->nom_commercial ?? 'Médicament',
                'heure' => substr((string) $prise->heure_prevue, 0, 5),
            ]);

        $stockFaible = Medicament::where('quantite_stock', '<=', 10)
            ->orderBy('quantite_stock')
            ->get(['nom_commercial', 'quantite_stock']);

        $ordonnances = Ordonnance::with(['patient.user', 'dosages.medicament'])
            ->where('responsable_id', $responsable->id)
            ->where('active', true)
            ->latest('date_prescription')
            ->take(5)
            ->get()
            ->map(fn (Ordonnance $ordonnance) => [
                'patient' => $ordonnance->patient?->nomComplet() ?? 'Patient',
                'medecin' => $ordonnance->nom_medecin,
                'date' => optional($ordonnance->date_prescription)->format('d/m/Y'),
                'medicaments' => $ordonnance->dosages
                    ->pluck('medicament.nom_commercial')
                    ->filter()
                    ->implode(', '),
            ]);

        return Inertia::render('Responsable/Dashboard', [
            'stats' => $stats,
            'adherence' => $adherence,
            'alertes' => $alertes,
            'stockFaible' => $stockFaible,
            'ordonnances' => $ordonnances,
        ]);
    }
}
