<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('deleted_beneficiary1', function (Blueprint $table) {
            $table->id();
            $table->string('mobile');
            $table->string('bene_id');
            $table->json('response');
            $table->timestamp('deleted_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('deleted_beneficiary1');
    }
};
