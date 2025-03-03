<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RechargeOperator extends Model
{
    protected $table = 'recharge_operators';
    protected $fillable = [
        'operator_name',
        'sms_api_operator_code',
        'service_name',
        'operator_status',
        'date',
        'status',
    ];
}

