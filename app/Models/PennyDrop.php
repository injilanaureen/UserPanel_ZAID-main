<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PennyDrop extends Model
{
    use HasFactory;

    protected $fillable = [
        'mobile',
        'accno',
        'bankid',
        'benename',
        'referenceid',
        'pincode',
        'address',
        'dob',
        'gst_state',
        'bene_id',
        'status',
        'response_code',
        'utr',
        'ackno',
        'txn_status',
        'message',
        'balance',
    ];
}
