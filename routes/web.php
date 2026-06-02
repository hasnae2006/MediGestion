<?php
//use Illuminate\Foundation\Application;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\OrdonnanceController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PriseMedicamentController;
use App\Http\Controllers\SosAlerteController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\ResponsableController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

 //Route::get('/', function () {
   // return Inertia::render('Welcome', [
       // 'canLogin' => Route::has('login'),
       // 'canRegister' => Route::has('register'),
        //'laravelVersion' => Application::VERSION,
      //  'phpVersion' => PHP_VERSION,
   // ]);
//});

//Route::get('/dashboard', function () {
    //return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

//Route::middleware('auth')->group(function () {
  //  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
   // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
   // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
//});
//  AUTH
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
// le respo
Route::middleware(['auth', 'role:responsable'])->prefix('responsable')->name('responsable.')->group(function () {
Route::get('/dashboard', [DashboardController::class, 'responsable'])->name('dashboard');
Route::resource('patients', PatientController::class)->only(['index', 'store', 'update', 'destroy']);
Route::resource('ordonnances', OrdonnanceController::class)->only(['index', 'store', 'update', 'destroy']);
   // Médicaments + réapprovisionnement
    Route::resource('medicaments', MedicamentController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('medicaments/{medicament}/stock', [MedicamentController::class, 'reapprovisionner'])->name('medicaments.stock');
    Route::get('alertes', [SosAlerteController::class, 'index'])->name('alertes.index');
    Route::patch('alertes/{sosAlerte}', [SosAlerteController::class, 'update'])->name('alertes.update');
Route::resource('medecins', MedecinController::class)->only(['index', 'store', 'update', 'destroy']);
Route::get('medecins/{medecin}/detail', [MedecinController::class, 'show'])->name('medecins.show');
Route::post('notifications/send', [NotificationController::class, 'send'])->name('notifications.send');
Route::get('historique', [PriseMedicamentController::class, 'historique'])->name('historique');
});
Route::put('/responsable/profil', [ResponsableController::class, 'updateProfil']);
Route::get('/responsable/profil', [ResponsableController::class, 'profil']);
//  le patient
Route::middleware(['auth', 'role:patient'])->prefix('patient')->name('patient.')->group(function () {
Route::get('profil', [ProfileController::class, 'show'])->name('profil');
Route::get('/dashboard', [PriseMedicamentController::class, 'index'])->name('dashboard');
Route::patch('prises/{prise}/confirmer', [PriseMedicamentController::class, 'confirmer'])->name('prises.confirmer');
Route::post('sos', [SosAlerteController::class, 'store'])->name('sos.store');
Route::get('sos', [SosAlerteController::class, 'create'])->name('sos');

//noti
Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

Route::get('/', function () {
    if (auth()->check()) {
        $role = auth()->user()->role;
        return redirect()->route("{$role}.dashboard");
    }
    return redirect()->route('login');
});

