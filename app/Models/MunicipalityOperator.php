<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class MunicipalityOperator extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',  // ✅ ID include kiya
        'name',
        'category',
        'displayname',
        'regex',
        'viewbill',
        'ad1_d_name',
        'ad1_name',
        'ad1_regex',
    ];

    public $incrementing = false; // ✅ Auto-increment off
    protected $keyType = 'string'; // ✅ ID ko string format me store karne ke liye
}
