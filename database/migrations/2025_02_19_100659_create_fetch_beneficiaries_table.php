<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fetch_beneficiaries', function (Blueprint $table) {
            $table->id();
            $table->string('bene_id')->unique();
            $table->string('bankid');
            $table->string('bankname');
            $table->string('name');
            $table->string('accno');
            $table->string('ifsc');
            $table->boolean('verified');
            $table->string('banktype');
            $table->boolean('paytm')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fetch_beneficiaries');
    }
};
