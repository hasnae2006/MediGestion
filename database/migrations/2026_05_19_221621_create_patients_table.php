<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->date('date_naissance')->nullable();
            $table->string('photo')->nullable();
            $table->enum('lien',['fils','fille',  'epoux', 'epouse', 'pere', 'mere', 'frere', 'soeur','infirmier','autre'])->default('autre');
            $table->enum('etat', ['actif', 'inactif', 'gueri'])->default('actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
