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
        Schema::create('lpg_operators', function (Blueprint $table) {
            $table->string('id')->primary(); // Non-incrementing ID
            $table->string('name');
            $table->string('category');
            $table->boolean('viewbill')->default(0);
            $table->string('regex')->nullable();
            $table->string('displayname')->nullable();
            $table->string('ad1_d_name')->nullable();
            $table->string('ad1_name')->nullable();
            $table->string('ad1_regex')->nullable();
            $table->string('ad2_d_name')->nullable();
            $table->string('ad2_name')->nullable();
            $table->string('ad2_regex')->nullable();
            $table->string('ad3_d_name')->nullable();
            $table->string('ad3_name')->nullable();
            $table->string('ad3_regex')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lpg_operators');
    }
};
