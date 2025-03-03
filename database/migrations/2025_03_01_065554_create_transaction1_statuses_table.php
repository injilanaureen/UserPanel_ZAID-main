<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('transaction1_statuses', function (Blueprint $table) {
            $table->id();
            $table->boolean('status')->default(false); // Store transaction status
            $table->integer('response_code')->nullable(); // Store response code
            $table->string('utr')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('ackno')->nullable();
            $table->string('referenceid')->unique();
            $table->string('account');
            $table->integer('txn_status');
            $table->string('message');
            $table->decimal('customercharge', 10, 2);
            $table->decimal('gst', 10, 2);
            $table->decimal('discount', 10, 2);
            $table->decimal('tds', 10, 2);
            $table->decimal('netcommission', 10, 2);
            $table->timestamp('daterefunded')->nullable();
            $table->string('refundtxnid')->nullable();
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction1_statuses');
    }
};
