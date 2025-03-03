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
        Schema::create('utility_bill_payments', function (Blueprint $table) {
            $table->id();
            $table->string('consumer_number');
            $table->boolean('status')->default(false);
            $table->string('response_code')->nullable();
            $table->string('operator_id')->nullable();
            $table->string('acknowledgement_no')->nullable();
            $table->string('reference_id')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utility_bill_payments');
    }
};
