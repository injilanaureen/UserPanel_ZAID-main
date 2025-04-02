<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FundRequest extends Model {
    use HasFactory;

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

    public function bank() {
        return $this->belongsTo(AddAccount::class, 'bank_id');
    }


    public static function getUserTotalBalance($userId)
    {
        return self::where('user_id', $userId)
            ->where('status', 1)  // Only approved transactions
            ->sum('amount');
    }

    public static function getUserSpentAmount($userId)
    {
        return Transaction::where('user_id', $userId)
            ->where('type', 'debit')
            ->where('status', 'completed')
            ->sum('amount');
    }

//calculate remaining balance for users formula=total approved balance-total spent
    public static function getRemainingBalance($userId)
    {
        $totalBalance = self::getUserTotalBalance($userId);
        $spentAmount = self::getUserSpentAmount($userId);
        return max(0, $totalBalance - $spentAmount);  // so that it never returns a negative balance 
    }
    
    // TRacks total available balance 
    public static function getAvailableBalance($userId) 
    {
        return self::where('user_id', $userId)
            ->where('status', 1) // Only approved requests
            ->sum('amount');
    } //same as gertUserBalance()

    // Get all approved fund requests for a user
    public static function getApprovedRequests($userId)
    {
        return self::where('user_id', $userId)
            ->where('status', 1)
            ->orderBy('created_at', 'asc') // Oldest first for FIFO
            ->get();
    }
}