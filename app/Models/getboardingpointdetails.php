<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class getboardingpointdetails extends Model
{
    use HasFactory;

    protected $table = 'getboardingpointdetails';

    protected $fillable = [
        'bpId', 'trip_id', 'response_code', 'status', 'address', 'contactnumber','id','landmark','locationName','name','rbMasterId'
    ];

}
