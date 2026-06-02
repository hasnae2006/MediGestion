<?php
namespace App\Http\Controllers;
use App\Http\Requests\SendNotificationRequest;
use App\Models\Notification;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $notifications = Notification::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn($n) => [
                'id'      => $n->id,
                'type'    => $n->type,
                'titre'   => $n->titre,
                'message' => $n->message,
                'lu'      => $n->lu,
                'date'    => $n->created_at->diffForHumans(),
            ]);

        Notification::where('user_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true, 'lu_at' => now()]);

        return Inertia::render('Patient/Notifications', compact('notifications'));
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return redirect()->back()->with('success', 'Notification supprimée.');
    }

    public function send(SendNotificationRequest $request)//le respo envoyer des notifs a patie
    {
        $data = $request->validated();

        $patient = Patient::with('user')->findOrFail($data['patient_id']);

        Notification::create([
            'user_id' => $patient->user_id,
            'type'    => $data['type'],
            'titre'   => $data['titre'],
            'message' => $data['message'],
        ]);

        return redirect()->back()->with('success', "Notification envoyée à {$patient->user->prenom} {$patient->user->nom}.");
    }
}
