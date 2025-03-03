<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemitterRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'mobile',
        'otp',
        'stateresp',
        'data',
        'accessmode',
        'is_iris',
        'limit', // Added limit to fillable
        'api_response',
        'status',
        'message'
    ];

    protected $casts = [
        'api_response' => 'array',
        'is_iris' => 'integer',
        'limit' => 'decimal:2'
    ];
}