<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegisterBeneficiary2 extends Model
{
    use HasFactory;

    protected $table = 'register_beneficiary2s';

    protected $fillable = [
        'bene_id',
        'bankid',
        'bankname',
        'name',
        'accno',
        'ifsc',
        'verified',
        'banktype',
        'status',
        'bank3',
        'message'
    ];

    protected $casts = [
        'verified' => 'boolean',
        'bank3' => 'boolean'
    ];
}
