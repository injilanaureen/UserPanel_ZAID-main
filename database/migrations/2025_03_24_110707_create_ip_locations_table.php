<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ip_locations', function (Blueprint $table) {
            $table->id();
            $table->string('ip');
            $table->string('lat');
            $table->string('lon');
            $table->timestamps();
            
            // Index to speed up IP lookups
            $table->index('ip');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_locations');
    }
};