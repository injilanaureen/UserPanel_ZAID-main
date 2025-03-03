<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('recharge_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('operator');  
            $table->string('canumber');  
            $table->decimal('amount', 10, 2); 
            $table->string('referenceid');  
            $table->string('status'); 
            $table->string('response_code');  
            $table->string('operatorid');  
            $table->string('ackno');  
            $table->string('message'); 
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('recharge_transactions');
    }
};
