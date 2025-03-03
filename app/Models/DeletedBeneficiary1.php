<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeletedBeneficiary1 extends Model
{
    use HasFactory;

    protected $table = 'deleted_beneficiary1';
    
    protected $fillable = ['mobile', 'bene_id', 'response'];
    
    protected $casts = [
        'response' => 'array',
    ];
}

