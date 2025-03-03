<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Remitter1Query extends Model
{
    use HasFactory;

    protected $table = 'remitter1_queries'; // Table name

    protected $fillable = [
        'status', 
        'response_code', 
        'message', 
        'mobile', 
        'limit'
    ];
}
