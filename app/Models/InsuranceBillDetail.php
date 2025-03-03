<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class InsuranceBillDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'canumber', 'ad1', 'ad2', 'mode', 'status', 'amount', 'name', 'duedate', 'billAmount', 'billnetamount', 'bill_dueDate', 'maxBillAmount', 'acceptPayment', 'acceptPartPay', 'cellNumber', 'userName', 'ad3', 'message'
    ];

    protected $casts = [
        'status' => 'boolean',
        'amount' => 'decimal:2',
        'billAmount' => 'decimal:2',
        'billnetamount' => 'decimal:2',
        'maxBillAmount' => 'decimal:2',
        'acceptPayment' => 'boolean',
        'acceptPartPay' => 'boolean'
    ];
}