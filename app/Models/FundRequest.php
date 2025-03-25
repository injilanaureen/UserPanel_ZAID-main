<?php 
namespace App\Models;  

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model;  

class FundRequest extends Model {     
    use HasFactory;      

    // Explicitly set the table name if different from default
    protected $table = 'fund_requests';

    protected $fillable = [         
        'transaction_type',         
        'amount',         
        'transaction_id',         
        'deposited_date',         
        'bank_id',
        'image_path',
        'status',
        'user_id'
    ];      

    public function bank()     {         
        return $this->belongsTo(AddAccount::class, 'bank_id');     
    } 
}