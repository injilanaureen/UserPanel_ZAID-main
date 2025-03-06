<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JwtToken extends Model
{
    protected $fillable = [
        'transaction_id',
        'jwt_token',
    ];

    // Relationship to RechargeTransaction
    public function transaction()
    {
        return $this->belongsTo(RechargeTransaction::class, 'transaction_id');
    }
}