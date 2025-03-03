<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FetchBeneficiary extends Model
{
    use HasFactory;

    protected $fillable = [
        'bene_id',
        'bankid',
        'bankname',
        'name',
        'accno',
        'ifsc',
        'verified',
        'banktype',
        'paytm',
    ]; 
     protected $casts = [
        'verified' => 'boolean',
        'paytm' => 'boolean',
    ];
}