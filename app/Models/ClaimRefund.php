<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClaimRefund extends Model
{
    use HasFactory;

    protected $fillable = ['ackno', 'referenceid', 'status', 'response_code', 'message'];
}
