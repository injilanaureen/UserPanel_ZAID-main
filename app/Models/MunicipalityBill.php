<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class MunicipalityBill extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'amount', 'response_code', 'status', 'message'];
}

//fetch details 