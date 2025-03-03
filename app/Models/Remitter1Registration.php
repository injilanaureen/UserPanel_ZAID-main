<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remitter1Registration extends Model
{
    use HasFactory;
    protected $table = 'remitter1_registration';

    protected $fillable = [
        'mobile', 'otp', 'stateresp', 'ekyc_id',
        'limit', 'message', 'response_code', 'status'
    ];
}
