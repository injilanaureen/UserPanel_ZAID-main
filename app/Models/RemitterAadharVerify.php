<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemitterAadharVerify extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'response_code',
        'message',
        'mobile',
        'masked_aadhaar',
    ];
}
