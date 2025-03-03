<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SourceCity extends Model
{
    protected $table = 'source_city';
    
    protected $fillable = [
        'city',
        'state',
        'location_type',
        'coordinates'
    ];
}