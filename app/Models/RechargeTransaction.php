<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RechargeTransaction extends Model
{
    use HasFactory;

    protected $table = 'recharge_transactions';

    protected $fillable = [
        'operator',
        'canumber',
        'amount',
        'referenceid',
        'status',
        'response_code',
        'operatorid',
        'ackno',
        'message',
    ];


    protected $casts = [
        'amount' => 'decimal:2', 
    ];
}
