<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 
    public function up(): void
    {
        Schema::create('transaction1OTP', function (Blueprint $table) {
          
            //form fields
            $table->id();
            $table->string('mobile');
            $table->string('referenceid');
            $table->string('bene_id');
            $table->string('txntype');
            $table->date('dob');
            $table->string('amount');
            $table->string('pincode')->nullable();
            $table->string('address')->nullable();
            $table->string('gst_state')->nullable();
            $table->string('lat')->nullable();
            $table->string('long')->nullable();
  
            
            // API response fields
            $table->boolean('status');
            $table->integer('response_code');         
            $table->string('message');
            $table->string('stateresp');
            

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction1OTP');
    }
};
