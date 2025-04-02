<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LogSession extends Model
{
    use HasFactory;

    protected $table = 'login_sessions';
    
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'gps_location',
        'ip_location',
        'device_id',
        'login_at'
    ];

    // Changed cast to ensure proper datetime handling
    protected $casts = [
        'login_at' => 'datetime:Y-m-d H:i:s',
    ];

    // Method to automatically set the login time to the current time when creating a record
    protected static function booted()
    {
        static::creating(function ($logSession) {
            $logSession->login_at = now()->setTimezone('Asia/Kolkata');
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}