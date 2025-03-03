<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionSentOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'mobile',
        'referenceid',
        'bene_id',
        'txntype',
        'amount',
        'pincode',
        'address',
        'gst_state',
        'dob',
        'lat',
        'long',
        'status',
        'response_code',
        'message',
        'txn_id',
        'ackno',
        'utr',
    ];
}
