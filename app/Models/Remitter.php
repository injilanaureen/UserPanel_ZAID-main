<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remitter extends Model
{
    use HasFactory;

    protected $fillable = [
        'mobile', 
        'limit', 
    ];

   
    protected $casts = [
        'limit' => 'decimal:2', 
    ];
}
