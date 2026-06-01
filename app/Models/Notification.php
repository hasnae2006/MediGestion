<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'type', 'titre', 'message', 'data', 'lu', 'lu_at',
    ];

    protected $casts = [
        'data'   => 'array',
        'lu'     => 'boolean',
        'lu_at'  => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function marquerLu(): void
    {
        $this->update(['lu' => true, 'lu_at' => now()]);
    }

    public function scopeNonLues($query)
    {
        return $query->where('lu', false);
    }
}
