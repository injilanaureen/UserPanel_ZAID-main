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
        Schema::create('addaccount', function (Blueprint $table) {
            $table->id();
            $table->string('bank');
            $table->string('account_name');
            $table->string('account_number');
            $table->string('confirm_account_number');
            $table->string('ifsc_code');
            $table->decimal('balance', 15, 2)->default(0.00); 
            $table->foreignId('userid')->constrained('users')->onDelete('cascade'); 
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addaccount');
    }
};
