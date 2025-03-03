<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UtilityBillPayment extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'consumer_number', 'status', 'response_code', 'operator_id', 'acknowledgement_no', 'reference_id', 'message'
    ];
}