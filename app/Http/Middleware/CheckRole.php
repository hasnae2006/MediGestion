<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{

/**
     * Vérifie que l'utilisateur a le rôle requis.
     *
     * Usage dans routes/web.php :
     *   Route::middleware(['auth', 'role:responsable'])->group(...)
     *   Route::middleware(['auth', 'role:patient'])->group(...)
     */
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! $request->user() || $request->user()->role !== $role) {
            abort(403, 'Accès refusé.');
        }
        return $next($request);
    }
}
