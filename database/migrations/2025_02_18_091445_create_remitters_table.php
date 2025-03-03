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
        Schema::create('remitters', function (Blueprint $table) {
            $table->id();
            $table->string('mobile')->unique(); // Mobile number (unique)
            $table->decimal('limit', 15, 2); // Limit (as a decimal type)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitters');
    }
};
