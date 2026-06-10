<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrdonnanceController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PriseMedicamentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResponsableController;
use App\Http\Controllers\SosAlerteController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth', 'role:responsable'])
    ->prefix('responsable')
    ->name('responsable.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'responsable'])->name('dashboard');
        Route::get('profil', [ResponsableController::class, 'profil'])->name('profil');
        Route::put('profil', [ResponsableController::class, 'updateProfil'])->name('profil.update');
        Route::resource('patients', PatientController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::post('patients/{patient}/programme', [PatientController::class, 'sendProgramme'])->name('patients.programme');
        Route::resource('ordonnances', OrdonnanceController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('medicaments', MedicamentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::patch('medicaments/{medicament}/stock', [MedicamentController::class, 'reapprovisionner'])->name('medicaments.stock');
        Route::get('alertes', [SosAlerteController::class, 'index'])->name('alertes.index');
        Route::patch('alertes/{sosAlerte}', [SosAlerteController::class, 'update'])->name('alertes.update');
        Route::resource('medecins', MedecinController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('medecins/{medecin}/detail', [MedecinController::class, 'show'])->name('medecins.show');
        Route::post('notifications/send', [NotificationController::class, 'send'])->name('notifications.send');
        Route::get('historique', [PriseMedicamentController::class, 'historique'])->name('historique');
    });

Route::middleware(['auth', 'role:patient'])
    ->prefix('patient')
    ->name('patient.')
    ->group(function () {
        Route::get('profil', [ProfileController::class, 'show'])->name('profil');
        Route::get('/dashboard', [PriseMedicamentController::class, 'index'])->name('dashboard');
        Route::patch('prises/{prise}/confirmer', [PriseMedicamentController::class, 'confirmer'])->name('prises.confirmer');
        Route::post('sos', [SosAlerteController::class, 'store'])->name('sos.store');
        Route::get('sos', [SosAlerteController::class, 'create'])->name('sos');
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
        Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    });

Route::get('/', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }

    return redirect()->route(auth()->user()->role.'.dashboard');
});
