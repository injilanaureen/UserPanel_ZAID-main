<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class MunicipalityTransaction extends Model
{
    use HasFactory;

    protected $table = 'municipality_transactions';

    protected $fillable = [
        'txnid', 'operatorname', 'canumber', 'amount', 'comm', 'tds', 'status',
        'refid', 'operatorid', 'dateadded', 'refunded', 'refundtxnid', 'daterefunded'
    ];

    protected $casts = [
        'dateadded' => 'datetime',
        'daterefunded' => 'datetime',
    ];
}

