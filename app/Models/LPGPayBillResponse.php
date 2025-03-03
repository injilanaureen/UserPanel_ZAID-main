<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LPGPayBillResponse extends Model
{
    use HasFactory;

    protected $table = 'lpg_pay_bill_responses';

    protected $fillable = [
        'canumber',
        'operator',
        'amount',
        'ad1',
        'ad2',
        'ad3',
        'referenceid',
        'latitude',
        'longitude',
        'operatorid',
        'status',
        'ackno',
        'message',
    ];
}
