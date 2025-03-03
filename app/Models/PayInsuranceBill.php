<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayInsuranceBill extends Model
{
    use HasFactory;

    protected $fillable = [
        'canumber',
        'mode',
        'amount',
        'ad1',
        'ad2',
        'ad3',
        'referenceid',
        'latitude',
        'longitude',
        'bill_number',
        'bill_amount',
        'bill_net_amount',
        'bill_date',
        'accept_payment',
        'accept_part_pay',
        'cell_number',
        'due_from',
        'due_to',
        'validation_id',
        'bill_id',
        'operator_id',
        'ackno',
        'refid',
        'message',
    ];
}
