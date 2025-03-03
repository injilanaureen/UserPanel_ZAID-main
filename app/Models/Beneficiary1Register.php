<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficiary1Register extends Model
{
    use HasFactory;

    protected $table = 'beneficiary1_registers';

    protected $fillable = [
        'mobile', 'benename', 'bankid', 'accno', 'ifsccode', 
        'verified', 'gst_state', 'dob', 'address', 'pincode',
        'banktype', 'bene_id', 'bankname'
    ];
}
