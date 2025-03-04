<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class getBookedTickets extends Model
{
    use HasFactory;

    protected $table = 'getbookedtickets';

    protected $fillable = [
        'pnr', 'tin', 'status', 'bus_type', 'source_city', 'source_city_id', 'destination_city', 'destination_city_id',
        'date_of_issue', 'doj', 'pickup_location', 'pickup_location_id', 'pickup_location_address', 'pickup_location_landmark',
        'drop_location', 'drop_location_id', 'drop_location_address', 'drop_location_landmark', 'pickup_time', 'drop_time',
        'prime_departure_time', 'fare', 'seat_name', 'passenger_name', 'passenger_mobile', 'passenger_email',
        'passenger_id_type', 'passenger_id_number', 'mticket_enabled', 'partial_cancellation_allowed', 'has_special_template',
        'has_rtc_breakup', 'cancellation_policy', 'cancellation_message', 'cancellation_calculation_timestamp',
        'primo_booking', 'vaccinated_bus', 'vaccinated_staff', 'service_charge', 'operator_service_charge',
        'service_tax', 'travels'
    ];
}
