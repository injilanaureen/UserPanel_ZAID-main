<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\FundRequest;
use App\Models\Transaction;

class AdminController extends Controller {
    public function loginpage() {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $post){
        $data = $post;
        if(!\Auth::validate(['email' => $data->email, 'password' => $data->password])){
            return response()->json(['status' => 'ERR', 'message' => 'Username or password is incorrect']);
        }
        if(!\Auth::validate(['email'=>$data->email, 'password'=>$data->password, 'status'=>'active'])){
            return response()->json(['status'=>'ERR', 'message' => 'Your account currently de-activated, please contact administrator']);
        }
    }

    public function dashboard(Request $request)
    {
        return Inertia::render('Admin/Dashboard');
    }

    // to fetch debit and credit balance based of status 
    public function getWalletBalance(Request $request)
    {
        $user = $request->user();
        
        $pendingAmount = FundRequest::where('user_id', $user->id)
            ->where('status', 0)
            ->sum('amount');
        
        $approvedAmount = FundRequest::getAvailableBalance($user->id);
        
        $spentAmount = Transaction::where('user_id', $user->id)
            ->where('status', 'completed')
            ->where('type', 'debit')
            ->sum('amount');
        
        $remainingBalance = max(0, $approvedAmount - $spentAmount);

        return response()->json([
            'credit' => $pendingAmount,
            'debit' => $remainingBalance, // Show remaining balance as debit
            'spent' => $spentAmount,
            'total_approved' => $approvedAmount
        ]);
    }
}