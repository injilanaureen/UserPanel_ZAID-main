<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LpgOperator extends Model
{
    use HasFactory;

    protected $table = 'lpg_operators';
    protected $primaryKey = 'id';
    public $incrementing = false; // Disables auto-incrementing ID
    protected $keyType = 'string'; // ID is a string

    protected $fillable = [
        'id', 'name', 'category', 'viewbill', 'regex', 'displayname',
        'ad1_d_name', 'ad1_name', 'ad1_regex',
        'ad2_d_name', 'ad2_name', 'ad2_regex',
        'ad3_d_name', 'ad3_name', 'ad3_regex'
    ];
}