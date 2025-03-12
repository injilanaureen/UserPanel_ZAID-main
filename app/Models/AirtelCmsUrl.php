<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class AirtelCmsUrl extends Model
{
    
    use HasFactory;

    protected $table = 'airtelcmsurl';

    protected $fillable = ['refid', 'latitude', 'longitude', 'message', 'redirectionUrl'];
}
