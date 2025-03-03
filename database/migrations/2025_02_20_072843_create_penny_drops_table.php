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
        Schema::create('penny_drops', function (Blueprint $table) {
        $table->id();
        $table->string('mobile');
        $table->string('accno');
        $table->string('bankid');
        $table->string('benename');
        $table->string('referenceid');
        $table->string('pincode')->nullable();
        $table->string('address')->nullable();
        $table->date('dob')->nullable();
        $table->string('gst_state')->nullable();
        $table->string('bene_id');

        // API Response Fields
        $table->boolean('status')->default(0);
        $table->integer('response_code')->nullable();
        $table->string('utr')->nullable();
        $table->string('ackno')->nullable();
        $table->string('txn_status')->nullable();
        $table->string('message')->nullable();
        $table->decimal('balance', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penny_drops');
    }
};
