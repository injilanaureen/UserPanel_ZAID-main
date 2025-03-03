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
        Schema::create('bill_payments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('canumber');
            $table->integer('operator');
            $table->decimal('amount', 10, 2);
            $table->integer('ad1');
            $table->integer('ad2');
            $table->bigInteger('ad3');
            $table->bigInteger('referenceid');
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 10, 6);
            $table->string('ackno');
            $table->string('operatorid');
            $table->string('message');
            $table->integer('response_code');
            $table->boolean('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_payments');
    }
};
