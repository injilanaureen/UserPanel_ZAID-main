<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'operator', 'canumber', 'mode', 'response_code', 
        'status', 'amount', 'name', 'duedate', 'ad2', 'ad3', 'message'
    ];
}
