<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class bookBusTicket extends Model
{
    use HasFactory;

    protected $table = 'book_bus_tickets';

    protected $fillable = [
        'refid', 'amount', 'base_fare', 'blockKey', 'passenger_phone', 'passenger_email','status','response_code','message'
    ];
}
