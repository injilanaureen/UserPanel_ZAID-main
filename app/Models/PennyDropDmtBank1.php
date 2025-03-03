<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PennyDropDmtBank1 extends Model
{
    use HasFactory;

    protected $table = 'penny_drop_dmt_bank1'; // Ensure this matches your table name

    protected $fillable = [
        'mobile',
        'account_number',
        'bank_id',
        'beneficiary_name',
        'reference_id',
        'pincode',
        'address',
        'dob',
        'gst_state',
        'bene_id',
        'utr',
        'ackno',
        'txn_status',
        'message',
        'balance',
        'refid',
    ];
}