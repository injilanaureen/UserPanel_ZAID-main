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
        Schema::create('register_beneficiary2s', function (Blueprint $table) {
            $table->id();
            $table->string('bene_id')->unique();
            $table->string('bankid');
            $table->string('bankname');
            $table->string('name');
            $table->string('accno');
            $table->string('ifsc');
            $table->boolean('verified')->default(0);
            $table->string('banktype')->nullable();
            $table->enum('status', ['0', '1'])->default('0');
            $table->boolean('bank3');
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('register_beneficiary2s');
    }
};
