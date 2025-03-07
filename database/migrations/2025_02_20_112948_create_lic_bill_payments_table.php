<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('lic_bill_payments', function (Blueprint $table) {
            $table->id();
            $table->string('canumber', 255);
            $table->string('mode', 50);
            $table->decimal('amount', 10, 2);
            $table->string('ad1', 255);
            $table->string('ad2', 255)->nullable();
            $table->string('ad3', 255)->nullable();
            $table->string('message', 500);
            $table->integer('response_code');
            
            // Bill Fetch Fields
            $table->decimal('billamount', 10, 2)->nullable();
            $table->decimal('billnetamount', 10, 2)->nullable();
            $table->date('due_date')->nullable();
            $table->decimal('max_bill_amount', 10, 2)->nullable();
            $table->boolean('accept_payment')->default(false);
            $table->boolean('accept_part_pay')->default(false);
            $table->string('cell_number', 100)->nullable();
            $table->string('billusername', 255)->nullable();

            $table->date('duedate')->nullable();
            $table->string('name', 255);
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lic_bill_payments');
    }
};
