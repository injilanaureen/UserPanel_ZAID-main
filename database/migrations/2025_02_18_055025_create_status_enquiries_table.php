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
        Schema::create('status_enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id')->unique();
            $table->string('txn_id')->nullable();
            $table->string('operator_name')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->decimal('commission', 10, 2)->nullable();
            $table->string('status')->nullable();
            $table->string('ref_id')->nullable();
            $table->string('operator_id')->nullable();
            $table->timestamp('date_added')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_enquiries');
    }
};
