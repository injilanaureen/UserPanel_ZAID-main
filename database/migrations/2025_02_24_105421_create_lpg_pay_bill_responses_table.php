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
        Schema::create('lpg_pay_bill_responses', function (Blueprint $table) {
            $table->id();
            $table->string('canumber');
            $table->string('operator');
            $table->decimal('amount', 10, 2);
            $table->string('ad1')->nullable();
            $table->string('ad2')->nullable();
            $table->string('ad3')->nullable();
            $table->string('referenceid');
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->string('operatorid')->nullable();
            $table->string('status')->default('Pending');
            $table->string('ackno')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lpg_pay_bill_responses');
    }
};
