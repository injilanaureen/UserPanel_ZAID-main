<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('remitter1_queries', function (Blueprint $table) {
            $table->id();
            $table->boolean('status')->default(false);
            $table->integer('response_code')->default(0);
            $table->string('message')->nullable();
            $table->string('mobile')->unique(); // Unique identifier
            $table->string('limit')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('remitter1_queries');
    }
};

