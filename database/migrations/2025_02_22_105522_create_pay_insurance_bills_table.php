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
        Schema::create('pay_insurance_bills', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('canumber');
            $table->string('mode');
            $table->decimal('amount', 10, 2);
            $table->string('ad1');
            $table->string('ad2');
            $table->string('ad3');
            $table->string('referenceid');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('bill_number');
            $table->decimal('bill_amount', 10, 2);
            $table->decimal('bill_net_amount', 10, 2);
            $table->timestamp('bill_date');
            $table->boolean('accept_payment');
            $table->boolean('accept_part_pay');
            $table->string('cell_number');
            $table->date('due_from');
            $table->date('due_to');
            $table->string('validation_id');
            $table->string('bill_id');
            $table->string('operator_id');
            $table->string('ackno');
            $table->string('refid');
            $table->string('message');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pay_insurance_bills');
    }
};
