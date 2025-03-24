<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddAccount extends Model
{
    use HasFactory;

    protected $table = 'addaccount';

    protected $fillable = [
        'bank',
        'account_name',
        'account_number',
        'confirm_account_number',
        'ifsc_code',
        'status',
        'userid',
        'balance'
    ];
}
