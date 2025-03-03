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
        Schema::create('book_bus_tickets', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('refid');
            $table->integer('amount');
            $table->string('base_fare');
            $table->string('blockKey');
            $table->string('passenger_phone');
            $table->string('passenger_email');
            $table->boolean('status')->default(false);
            $table->integer('response_code')->nullable();
            $table->string('message')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_bus_tickets');
    }
};
