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
        Schema::create('insurance_bill_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('canumber');
            $table->string('ad1');
            $table->string('ad2')->nullable();
            $table->string('mode');
            $table->boolean('status');
            $table->decimal('amount', 10, 2);
            $table->string('name')->nullable();
            $table->date('duedate')->nullable();
            $table->decimal('billAmount', 10, 2);
            $table->decimal('billnetamount', 10, 2);
            $table->date('bill_dueDate')->nullable();
            $table->decimal('maxBillAmount', 10, 2);
            $table->boolean('acceptPayment');
            $table->boolean('acceptPartPay');
            $table->string('cellNumber');
            $table->string('userName');
            $table->string('ad3')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insurance_bill_details');
    }
};
