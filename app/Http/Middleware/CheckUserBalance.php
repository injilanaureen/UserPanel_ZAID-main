<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\FundRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Transaction;
class CheckUserBalance
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $transactionAmount = $request->input('amount');
        
        // Calculate total approved funds
        $totalApproved = FundRequest::getAvailableBalance($user->id);
        
        // Calculate total spent amount
        $spentAmount = Transaction::where('user_id', $user->id)
            ->where('status', 'completed')
            ->where('type', 'debit')
            ->sum('amount');
        
        $remainingBalance = $totalApproved - $spentAmount;

        if ($transactionAmount > $remainingBalance) {
            return response()->json([
                'error' => 'Funds are insufficient. Please add money to complete the payment',
                'remaining_balance' => $remainingBalance
            ], 403);
        }

        return $next($request);
    }
}