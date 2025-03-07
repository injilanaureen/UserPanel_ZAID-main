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
        Schema::create('lic_enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('ad1')->nullable();
            $table->string('ad2')->nullable();
            $table->string('ad3')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('canumber');
            $table->decimal('comm', 10, 2);
            $table->timestamp('dateadded');
            $table->timestamp('daterefunded')->nullable();
            $table->string('operatorid');
            $table->string('operatorname');
            $table->string('refid');
            $table->boolean('refunded');
            $table->string('refundtxnid')->nullable();
            $table->integer('status');
            $table->decimal('tds', 10, 2);
            $table->string('txnid');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lic_enquiries');
    }
};
