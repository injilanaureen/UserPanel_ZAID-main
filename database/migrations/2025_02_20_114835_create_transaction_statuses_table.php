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
        Schema::create('transaction_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('ackno')->nullable();
            $table->string('referenceid')->unique();
            $table->string('status')->nullable();
            $table->string('response_code')->nullable();
            $table->string('utr')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('account')->nullable();
            $table->string('txn_status')->nullable();
            $table->text('message')->nullable();
            $table->decimal('customercharge', 10, 2)->nullable();
            $table->decimal('gst', 10, 2)->nullable();
            $table->decimal('bc_share', 10, 2)->nullable();
            $table->decimal('tds', 10, 2)->nullable();
            $table->decimal('netcommission', 10, 2)->nullable();
            $table->dateTime('daterefunded')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_statuses');
    }
};
