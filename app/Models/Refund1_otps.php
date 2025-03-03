<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund1_otps extends Model
{
    use HasFactory;

    protected $fillable = [
        'referenceid', 'ackno', 'otp', 'status', 'response_code', 'message'
    ];
}