<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;



class Transaction1OTP extends Model
{
    use HasFactory;
    protected $table = 'transaction1OTP';

    protected $fillable = [
        'mobile', 'referenceid', 'bene_id', 'txntype', 'dob',
        'amount', 'pincode', 'address', 'gst_state', 'lat', 'long',
        'status', 'response_code', 'message', 'stateresp'
    ];
}
