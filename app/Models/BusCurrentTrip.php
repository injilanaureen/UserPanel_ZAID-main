<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusCurrentTrip extends Model
{
    use HasFactory;

    protected $fillable = [
        'location', 'address', 'city', 'time', 'landmark', 'contact'
    ];
}
