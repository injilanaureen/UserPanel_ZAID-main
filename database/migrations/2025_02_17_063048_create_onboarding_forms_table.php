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
        Schema::create('onboarding_forms', function (Blueprint $table) {
            $table->id();
            $table->string('merchantcode'); 
            $table->string('mobile');
            $table->boolean('is_new')->default(0);
            $table->string('email');
            $table->string('firm')->default('PAYSPRINT');
            $table->string('aadhaarFront')->nullable();
            $table->string('aadhaarBack')->nullable();
            $table->string('panCard')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboarding_forms');
    }
};
