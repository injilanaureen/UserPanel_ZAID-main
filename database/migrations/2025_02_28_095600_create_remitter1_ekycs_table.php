
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
        Schema::create('remitter1_ekycs', function (Blueprint $table) {
            $table->id();
            $table->string('mobile')->unique();
            $table->string('aadhaar_number')->unique();
            $table->string('lat');
            $table->string('long');
            $table->text('data'); // Storing encrypted PID data
            $table->tinyInteger('is_iris')->default(2);
            $table->boolean('status')->default(false);
            $table->integer('response_code')->nullable();
            $table->string('message')->nullable();
            $table->string('ekyc_id')->nullable();
            $table->string('stateresp')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitter1_ekycs');
    }
};
