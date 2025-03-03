<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusEnquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_id', 'txn_id', 'operator_name', 'amount', 'commission', 'status', 'ref_id', 'operator_id', 'date_added', 'message'
    ];
}
