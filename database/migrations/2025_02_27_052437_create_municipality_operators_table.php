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
        Schema::create('municipality_operators', function (Blueprint $table) {
            $table->string('id')->primary(); // ✅ ID string format me store hoga, auto-increment nahi hoga
            $table->string('name');
            $table->string('category');
            $table->string('displayname');
            $table->string('regex')->nullable();
            $table->string('viewbill');
            $table->string('ad1_d_name')->nullable();
            $table->string('ad1_name')->nullable();
            $table->string('ad1_regex')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('municipality_operators');
    }
};
