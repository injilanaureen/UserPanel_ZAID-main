<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class FastagOperatorList extends Model
{
    use HasFactory;

    protected $table = 'fastagoperatorlist';

    protected $fillable = [
        'operator_id', 'name', 'category', 'viewbill', 'displayname', 'regex', 'ad1_regex'
    ];
}