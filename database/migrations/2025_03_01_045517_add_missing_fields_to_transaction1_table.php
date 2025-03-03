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
        Schema::table('transaction1', function (Blueprint $table) {
            // Add the new columns after the 'dob' column
            $table->string('amount')->after('dob');
            $table->string('pincode')->nullable()->after('amount');
            $table->string('address')->nullable()->after('pincode');
            $table->string('gst_state')->nullable()->after('address');
            $table->string('lat')->nullable()->after('gst_state');
            $table->string('long')->nullable()->after('lat');
            $table->string('otp')->after('long');
            $table->string('stateresp')->after('otp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction1', function (Blueprint $table) {
            // Drop the columns if the migration is rolled back
            $table->dropColumn([
                'amount',
                'pincode',
                'address',
                'gst_state',
                'lat',
                'long',
                'otp',
                'stateresp'
            ]);
        });
    }
};