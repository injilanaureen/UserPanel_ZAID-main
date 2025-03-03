<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingForm extends Model
{
    use HasFactory;

    protected $table = 'onboarding_forms';

    protected $fillable = [
        'merchantcode',
        'mobile',
        'is_new',
        'email',
        'firm',
        'aadhaarFront',
        'aadhaarBack',
        'panCard',
    ];
}
  
