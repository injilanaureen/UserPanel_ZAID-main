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
        'balance',
        'userid',
        'status'
    ];

    // Relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class, 'userid');
    }

    // Scope to get only active accounts
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}