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
        Schema::create('fetchby_benieds', function (Blueprint $table) {
            $table->id();
            $table->string('mobile', 10);
            $table->string('bene_id');
            $table->string('bank_id')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc')->nullable();
            $table->boolean('verified');
            $table->string('bank_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fetchby_benieds');
    }
};
