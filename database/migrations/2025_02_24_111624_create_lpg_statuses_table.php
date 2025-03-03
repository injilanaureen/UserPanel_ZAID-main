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
        Schema::create('lpg_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id')->unique();
            $table->string('txnid')->nullable();
            $table->string('operator_name')->nullable();
            $table->string('customer_number')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('tds', 10, 2)->nullable();
            $table->string('operator_id')->nullable();
            $table->string('refid')->nullable();
            $table->dateTime('date_added')->nullable();
            $table->boolean('refunded')->default(false);
            $table->dateTime('date_refunded')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lpg_statuses');
    }
};
