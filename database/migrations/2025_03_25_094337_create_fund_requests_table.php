<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
//old
return new class extends Migration {
    public function up(): void {
        Schema::create('fund_requests', function (Blueprint $table) {
            $table->id();
            $table->enum('transaction_type', ['NEFT', 'RTGS', 'IMPS']);
            $table->decimal('amount', 10, 2);
            $table->string('transaction_id')->unique();
            $table->date('deposited_date');
            
            $table->foreignId('bank_id')
                  ->constrained('addaccount') 
                  ->onDelete('cascade');
            
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
            
            $table->string('file_path')->nullable();
            $table->boolean('status')->default(0); 
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('fund_requests');
    }
};