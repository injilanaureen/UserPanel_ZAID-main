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
        Schema::create('municipality_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('txnid');
            $table->string('operatorname');
            $table->string('canumber');
            $table->decimal('amount', 10, 2);
            $table->decimal('comm', 10, 2);
            $table->decimal('tds', 10, 2);
            $table->string('status');
            $table->string('refid');
            $table->string('operatorid');
            $table->timestamp('dateadded');
            $table->boolean('refunded');
            $table->string('refundtxnid')->nullable();
            $table->timestamp('daterefunded')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('municipality_transactions');
    }
};
