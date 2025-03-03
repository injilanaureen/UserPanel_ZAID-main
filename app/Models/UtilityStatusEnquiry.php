<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UtilityStatusEnquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_id',
        'transaction_id',
        'operator_name',
        'customer_number',
        'amount',
        'additional_data_1',
        'additional_data_2',
        'additional_data_3',
        'commission',
        'tds',
        'transaction_status',
        'operator_id',
        'date_added',
        'refunded',
        'refund_transaction_id',
        'date_refunded'
    ];
}
