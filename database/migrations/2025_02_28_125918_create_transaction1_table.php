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
        Schema::create('transaction1', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('referenceid');
            $table->string('bene_id');
            $table->string('txntype');
            $table->date('dob');
            
            // New fields
            $table->string('amount');
            $table->string('pincode')->nullable();
            $table->string('address')->nullable();
            $table->string('gst_state')->nullable();
            $table->string('lat')->nullable();
            $table->string('long')->nullable();
            $table->string('otp');
            $table->string('stateresp');
            
            // API response fields
            $table->boolean('status');
            $table->integer('response_code');
            $table->string('ackno');
            $table->string('utr');
            $table->integer('txn_status');
            $table->string('benename');
            $table->text('remarks');
            $table->string('message');
            $table->decimal('customercharge', 10, 2);
            $table->decimal('gst', 10, 2);
            $table->decimal('tds', 10, 2);
            $table->decimal('netcommission', 10, 2);
            $table->string('remitter');
            $table->string('account_number');
            $table->decimal('paysprint_share', 10, 2);
            $table->decimal('txn_amount', 10, 2);
            $table->decimal('balance', 15, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction1');
    }
};