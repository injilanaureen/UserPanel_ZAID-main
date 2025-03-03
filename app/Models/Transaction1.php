<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction1 extends Model {
    use HasFactory;
    protected $table = 'transaction1';

    protected $fillable = [
        'mobile', 'referenceid', 'bene_id', 'txntype', 'dob',
        'amount', 'pincode', 'address', 'gst_state', 'lat', 'long', 'otp', 'stateresp',
        'status', 'response_code', 'ackno', 'utr', 'txn_status', 'benename', 'remarks',
        'message', 'customercharge', 'gst', 'tds', 'netcommission', 'remitter',
        'account_number', 'paysprint_share', 'txn_amount', 'balance'
    ];
}