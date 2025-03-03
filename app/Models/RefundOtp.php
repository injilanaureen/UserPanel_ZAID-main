<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefundOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'referenceid',
        'ackno',
        'status',
        'response_code',
        'message',
    ];
}
