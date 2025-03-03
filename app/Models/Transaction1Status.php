<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction1Status extends Model
{
    use HasFactory;

    protected $fillable = [
        'status', 'response_code', 'utr', 'amount', 'ackno', 'referenceid', 
        'account', 'txn_status', 'message', 'customercharge', 'gst', 
        'discount', 'tds', 'netcommission', 'daterefunded', 'refundtxnid'
    ];
    
}
