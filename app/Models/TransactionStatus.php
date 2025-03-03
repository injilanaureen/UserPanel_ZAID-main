<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'ackno',
        'referenceid',
        'status',
        'response_code',
        'utr',
        'amount',
        'account',
        'txn_status',
        'message',
        'customercharge',
        'gst',
        'bc_share',
        'tds',
        'netcommission',
        'daterefunded',
    ];
}
