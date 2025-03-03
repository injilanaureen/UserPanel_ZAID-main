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
        Schema::create('utility_status_enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id')->unique();
            $table->string('transaction_id')->nullable();
            $table->string('operator_name')->nullable();
            $table->string('customer_number')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('additional_data_1')->nullable();
            $table->string('additional_data_2')->nullable();
            $table->string('additional_data_3')->nullable();
            $table->decimal('commission', 10, 2)->nullable();
            $table->decimal('tds', 10, 2)->nullable();
            $table->string('transaction_status')->nullable();
            $table->string('operator_id')->nullable();
            $table->string('date_added')->nullable();
            $table->boolean('refunded')->default(false);
            $table->string('refund_transaction_id')->nullable();
            $table->string('date_refunded')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_status_enquiries');
    }
};
