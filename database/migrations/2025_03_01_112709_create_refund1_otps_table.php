<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('refund1_otps', function (Blueprint $table) {
            $table->id();
            $table->string('referenceid');
            $table->string('ackno');
            $table->string('otp');
            $table->boolean('status')->default(false);
            $table->integer('response_code')->nullable();
            $table->string('message')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('refund1_otps');
    }
};
