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
        Schema::create('utility_operators', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->boolean('viewbill')->default(false);
            $table->string('displayname')->nullable();
            $table->text('regex')->nullable(); // Changed from string to text
            $table->string('ad1_d_name')->nullable();
            $table->string('ad1_name')->nullable();
            $table->text('ad1_regex')->nullable(); // Changed from string to text
            $table->string('ad2_d_name')->nullable();
            $table->string('ad2_name')->nullable();
            $table->text('ad2_regex')->nullable(); // Changed from string to text
            $table->string('ad3_d_name')->nullable();
            $table->string('ad3_name')->nullable();
            $table->text('ad3_regex')->nullable(); // Changed from string to text
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_operators');
    }
};
