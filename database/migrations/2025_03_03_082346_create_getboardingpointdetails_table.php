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
        Schema::create('getboardingpointdetails', function (Blueprint $table) {
       
            $table->timestamps();
            $table->integer('bpId');
            $table->integer('trip_id');
            $table->string('address');
            $table->string('contactnumber');
            $table->string('id');
            $table->string('landmark');
            $table->string('locationName');
            $table->string('name');
            $table->string('rbMasterId');
            $table->boolean('status')->default(false);
            $table->integer('response_code')->nullable();
  

        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('getboardingpointdetails');
    }
};
