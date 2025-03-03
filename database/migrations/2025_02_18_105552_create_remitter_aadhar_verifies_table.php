<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. old
     */
    public function up()
    {
        Schema::create('remitter_aadhar_verifies', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->string('response_code');
            $table->string('message');
            $table->string('mobile');
            $table->string('aadhaar_no');
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitter_aadhar_verifies');
    }
};
