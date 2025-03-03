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
        Schema::create('remitter_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('mobile', 10);
            $table->string('otp', 6);
            $table->string('stateresp');
            $table->string('data');
            $table->enum('accessmode', ['SITE', 'API']);
            $table->tinyInteger('is_iris');
            $table->decimal('limit', 10, 2)->nullable(); // Added limit column
            $table->json('api_response')->nullable();
            $table->string('status')->nullable();
            $table->string('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitter_registrations');
    }
};
