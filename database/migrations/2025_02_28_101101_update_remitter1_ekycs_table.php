<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('remitter1_ekycs', function (Blueprint $table) {
            $table->boolean('status')->default(false);
            $table->integer('response_code')->nullable();
            $table->string('message')->nullable();
            $table->string('ekyc_id')->nullable();
            $table->string('stateresp')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remitter1_ekycs', function (Blueprint $table) {
            $table->dropColumn(['status', 'response_code', 'message', 'ekyc_id', 'stateresp']);
        });
    }
};
