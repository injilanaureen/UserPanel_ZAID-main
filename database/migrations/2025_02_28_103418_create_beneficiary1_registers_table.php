<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('beneficiary1_registers', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('benename');
            $table->string('bankid');
            $table->string('accno');
            $table->string('ifsccode');
            $table->boolean('verified')->default(0);
            $table->string('gst_state')->nullable();
            $table->date('dob')->nullable();
            $table->text('address')->nullable();
            $table->string('pincode')->nullable();
            $table->string('banktype')->nullable();
            $table->string('bene_id')->nullable();
            $table->string('bankname')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('beneficiary1_registers');
    }
};

