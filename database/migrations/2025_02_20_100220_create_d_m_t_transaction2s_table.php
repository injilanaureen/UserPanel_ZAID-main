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
        Schema::create('d_m_t_transaction2s', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('pincode');
            $table->string('address');
            $table->decimal('amount', 10, 2);
            $table->string('txntype');
            $table->date('dob')->nullable();
            $table->string('gst_state');
            $table->string('bene_id');
            $table->string('otp')->nullable();
            $table->string('stateresp')->nullable();
            $table->decimal('lat', 10, 6);
            $table->decimal('long', 10, 6);
            $table->boolean('status');
            $table->integer('response_code');
            $table->string('ackno');
            $table->string('referenceid');
            $table->string('utr')->nullable();
            $table->integer('txn_status');
            $table->string('benename');
            $table->string('remarks');
            $table->string('message');
            $table->string('remitter');
            $table->string('account_number');
            $table->decimal('bc_share', 8, 2);
            $table->decimal('txn_amount', 10, 2);
            $table->string('NPCI_response_code')->nullable();
            $table->string('bank_status');
            $table->decimal('customercharge', 8, 2);
            $table->decimal('gst', 8, 2);
            $table->decimal('tds', 8, 2);
            $table->decimal('netcommission', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('d_m_t_transaction2s');
    }
};
