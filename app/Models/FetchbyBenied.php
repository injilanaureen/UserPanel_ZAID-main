<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class FetchbyBenied extends Model
{
    use HasFactory;

    protected $fillable = [
        'mobile',
        'bene_id',
        'bank_id',
        'bank_name',
        'name',
        'account_number',
        'ifsc',
        'verified',
        'bank_type',
    ];
}
