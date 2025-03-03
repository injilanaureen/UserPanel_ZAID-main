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
        Schema::create('transaction_sent_otps', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('referenceid');
            $table->string('bene_id');
            $table->string('txntype')->default('IMPS');
            $table->decimal('amount', 10, 2);
            $table->string('pincode')->nullable();
            $table->string('address')->nullable();
            $table->string('gst_state')->nullable();
            $table->date('dob')->nullable();
            $table->string('lat')->nullable();
            $table->string('long')->nullable();

            // API Response Fields
            $table->boolean('status')->default(0);
            $table->integer('response_code')->nullable();
            $table->string('message')->nullable();
            $table->string('txn_id')->nullable();
            $table->string('ackno')->nullable();
            $table->string('utr')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_sent_otps');
    }
};
