<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penny_drop_dmt_bank1', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('account_number');
            $table->unsignedInteger('bank_id');
            $table->string('beneficiary_name')->nullable();
            $table->string('reference_id');
            $table->unsignedInteger('pincode');
            $table->string('address');
            $table->string('dob');
            $table->string('gst_state');
            $table->unsignedInteger('bene_id');
            $table->string('utr')->nullable();
            $table->string('ackno')->nullable();
            $table->tinyInteger('txn_status')->nullable();
            $table->string('message')->nullable();
            $table->decimal('balance', 10, 2)->nullable();
            $table->string('refid')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penny_drop_dmt_ban1');
    }
};

