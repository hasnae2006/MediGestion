<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('sos_alertes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                  ->constrained('patients')
                  ->onDelete('cascade');
            $table->foreignId('responsable_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->text('message');
            $table->enum('statut', ['envoye', 'lu', 'traite'])->default('envoye');
            $table->timestamps();

            $table->index(['responsable_id', 'statut']);
            $table->index('patient_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sos_alertes');
    }
};
