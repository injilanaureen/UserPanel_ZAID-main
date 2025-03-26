<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiManagement extends Model
{
    use HasFactory;

    // Specify the table name if different from default convention
    protected $table = 'apimanagement';

    // Fillable fields
    protected $fillable = [
        'api_name', 
        'api_type', 
        'api_url'
    ];

    // Optional: Define any relationships or custom methods
}