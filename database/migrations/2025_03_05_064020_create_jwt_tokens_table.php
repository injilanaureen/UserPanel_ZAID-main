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
        Schema::create('jwt_tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id'); // Foreign key to recharge_transactions
            $table->text('jwt_token'); // Column to store the JWT token
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('transaction_id')
                  ->references('id')
                  ->on('recharge_transactions')
                  ->onDelete('cascade'); // Delete JWT token if the transaction is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jwt_tokens');
    }
};
