<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LPGStatus extends Model {
    use HasFactory;

    protected $table = 'lpg_statuses';

    protected $fillable = [
        'reference_id',
        'txnid',
        'operator_name',
        'customer_number',
        'amount',
        'tds',
        'operator_id',
        'refid',
        'date_added',
        'refunded',
        'date_refunded',
        'message',
    ];
}
