<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillPayment extends Model
{
    protected $fillable = [
        'canumber',
        'mode',
        'amount',
        'ad1',
        'ad2',
        'ad3',
        'referenceid',
        'latitude',
        'longitude',
        'bill_fetch',
        'response_code',
        'operatorid',
        'ackno',
        'refid',
        'message',
    ];

    protected $casts = [
        'bill_fetch' => 'array',
        'amount' => 'decimal:2',
    ];
    protected $table='licbill_payments';
}