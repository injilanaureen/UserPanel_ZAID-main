<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('getbookedtickets', function (Blueprint $table) {
            $table->id();
            $table->string('pnr')->unique();
            $table->string('tin')->nullable();
            $table->string('status');
            $table->string('bus_type');
            $table->string('source_city');
            $table->string('source_city_id');
            $table->string('destination_city');
            $table->string('destination_city_id');
            $table->dateTime('date_of_issue');
            $table->dateTime('doj');
            $table->string('pickup_location');
            $table->string('pickup_location_id');
            $table->string('pickup_location_address');
            $table->string('pickup_location_landmark');
            $table->string('drop_location');
            $table->string('drop_location_id');
            $table->string('drop_location_address');
            $table->string('drop_location_landmark');
            $table->string('pickup_time');
            $table->string('drop_time');
            $table->string('prime_departure_time');
            $table->string('fare');
            $table->string('seat_name');
            $table->string('passenger_name');
            $table->string('passenger_mobile');
            $table->string('passenger_email');
            $table->string('passenger_id_type')->nullable();
            $table->string('passenger_id_number')->nullable();
            $table->boolean('mticket_enabled');
            $table->boolean('partial_cancellation_allowed');
            $table->boolean('has_special_template');
            $table->boolean('has_rtc_breakup');
            $table->string('cancellation_policy')->nullable();
            $table->string('cancellation_message')->nullable();
            $table->string('cancellation_calculation_timestamp')->nullable();
            $table->boolean('primo_booking');
            $table->boolean('vaccinated_bus');
            $table->boolean('vaccinated_staff');
            $table->string('service_charge');
            $table->string('operator_service_charge');
            $table->string('service_tax');
            $table->string('travels');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('getbookedtickets');
    }
};
