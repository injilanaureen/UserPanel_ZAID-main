<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DMTTransaction2 extends Model
{
    use HasFactory;

    protected $fillable = [
        'mobile', 'referenceid', 'pincode', 'address', 'amount', 'txntype',
        'dob', 'gst_state', 'bene_id', 'otp', 'stateresp', 'lat', 'long',
        'status', 'response_code', 'ackno', 'utr', 'txn_status', 'benename',
        'remarks', 'message', 'remitter', 'account_number', 'bc_share',
        'txn_amount', 'NPCI_response_code', 'bank_status', 'customercharge',
        'gst', 'tds', 'netcommission',
    ];
}
