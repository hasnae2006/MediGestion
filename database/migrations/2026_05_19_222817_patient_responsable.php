<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('patient_responsable', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                  ->constrained('patients')
                  ->onDelete('cascade');

            $table->foreignId('responsable_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->date('date_debut')->default(now());
            $table->date('date_fin')->nullable(); // null = encore actif
            $table->boolean('actif')->default(true);

            $table->timestamps();

            // Contrainte : un patient ne peut pas être lié
            // deux fois au MÊME responsable en même temps
            $table->unique(['patient_id', 'responsable_id']);

            // Index pour les requêtes fréquentes
            $table->index(['patient_id',     'actif']);
            $table->index(['responsable_id', 'actif']);
        });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
