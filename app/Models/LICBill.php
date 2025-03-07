<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LICBill extends Model
{
    use HasFactory;

    protected $table = 'lic_bill_payments'; // Make sure this matches your database table name

    protected $fillable = [
        'canumber',
        'mode',
        'amount',
        'ad1',
        'ad2',
        'ad3',
        'message',
        'response_code',
        'billamount',
        'billnetamount',
        'due_date',
        'max_bill_amount',
        'accept_payment',
        'accept_part_pay',
        'cell_number',
        'billusername',
        'duedate',
        'name',
    ];
}

