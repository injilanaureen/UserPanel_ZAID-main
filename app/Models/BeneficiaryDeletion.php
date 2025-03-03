<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeneficiaryDeletion extends Model
{
    protected $fillable = [
        'mobile',
        'bene_id',
        'status',
        'response_code',
        'message'
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}