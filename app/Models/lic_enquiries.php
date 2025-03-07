<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class lic_enquiries extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad1',
        'ad2',
        'ad3',
        'amount',
        'canumber',
        'comm',
        'dateadded',
        'daterefunded',
        'operatorid',
        'operatorname',
        'refid',
        'refunded',
        'refundtxnid',
        'status',
        'tds',
        'txnid',
    ];
}
