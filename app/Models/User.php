<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
     protected $fillable = [
        'nom', 'prenom', 'telephone', 'email', 'role', 'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
   protected $hidden = ['password', 'remember_token'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
    // ─── Relations ────────────────────────────────────────────

    /** Le compte patient lié (si role = patient) */
    public function patient()
    {
        return $this->hasOne(Patient::class);
    }

    /** Patients dont cet user est responsable (table pivot) */
    public function patientsGeres()
    {
        return $this->belongsToMany(Patient::class, 'patient_responsable', 'responsable_id', 'patient_id')
                    ->withPivot(['date_debut', 'date_fin', 'actif'])
                    ->withTimestamps();
    }

    /** Ordonnances créées par ce responsable */
    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class, 'responsable_id');
    }

    /** Notifications de cet utilisateur */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /** Alertes SOS reçues (si responsable) */
    public function sosAlertesRecues()
    {
        return $this->hasMany(SosAlerte::class, 'responsable_id');
    }

    // ─── Scopes ───────────────────────────────────────────────

    public function scopeResponsables($query)
    {
        return $query->where('role', 'responsable');
    }

    public function scopePatients($query)
    {
        return $query->where('role', 'patient');
    }

    // ─── Helpers ──────────────────────────────────────────────

    public function isResponsable(): bool
    {
        return $this->role === 'responsable';
    }

    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    public function nomComplet(): string
    {
        return "{$this->prenom} {$this->nom}";
    }
}
