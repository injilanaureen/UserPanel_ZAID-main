<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('remitter1_registration', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('otp');
            $table->string('stateresp');
            $table->string('ekyc_id');
            $table->string('limit');
            $table->string('message');
            $table->integer('response_code');
            $table->boolean('status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('remitter1_registration');
    }
};
