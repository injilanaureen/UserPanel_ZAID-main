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
        Schema::create('lpg_bill_details', function (Blueprint $table) {
            $table->id();
            $table->string('operator');
            $table->string('canumber');
            $table->string('referenceid')->nullable();
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->string('ad1')->nullable();
            $table->string('ad2')->nullable();
            $table->string('ad3')->nullable();
            $table->string('ad4')->nullable();
            $table->string('response_code');
            $table->string('status');
            $table->decimal('amount', 10, 2);
            $table->string('name');
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lpg_bill_details');
    }
};
