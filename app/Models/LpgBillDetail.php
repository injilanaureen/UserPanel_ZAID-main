<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LpgBillDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'operator',
        'canumber',
        'referenceid',
        'latitude',
        'longitude',
        'ad1',
        'ad2',
        'ad3',
        'ad4',
        'response_code',
        'status',
        'amount',
        'name',
        'message',
    ];
}
