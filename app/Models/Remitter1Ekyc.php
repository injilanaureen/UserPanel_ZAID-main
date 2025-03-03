<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remitter1Ekyc extends Model
{
    use HasFactory;

    protected $table = 'remitter1_ekycs';

    protected $fillable = [
        'mobile',
        'aadhaar_number',
        'lat',
        'long',
        'data',
        'is_iris',
        'status',
        'response_code',
        'message',
        'ekyc_id',
        'stateresp',
    ];
}
