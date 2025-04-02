<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LastLogin extends Model
{
    protected $fillable = ['user_id', 'ip_address', 'login_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
