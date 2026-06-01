<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prise_medicaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosage_id')->constrained('dosages')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('temps_id')->constrained('temps')->onDelete('cascade');
            $table->date('date_prevue');
            $table->time('heure_prevue');
            $table->date('date_prise_reelle')->nullable();
            $table->time('heure_prise_reelle')->nullable();
            $table->enum('statut', ['en_attente', 'pris', 'manque', 'reporte'])->default('en_attente');
            $table->timestamps();

            $table->index(['patient_id', 'statut']);
            $table->index(['dosage_id',  'date_prevue']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prise_medicaments');
    }
};
