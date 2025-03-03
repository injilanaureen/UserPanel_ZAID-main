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
        Schema::create('bus_current_trips', function (Blueprint $table) {
            $table->id();
            $table->string('trip_id');
            $table->string('location');
            $table->text('address');
            $table->string('city');
            $table->integer('time');
            $table->string('landmark')->nullable();
            $table->string('contact')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bus_current_trips');
    }
};
