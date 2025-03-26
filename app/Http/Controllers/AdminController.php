<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\FundRequest;

class AdminController extends Controller {
    public function dashboard(Request $request)
    {
        return Inertia::render('Admin/Dashboard');
    }

    // New method to fetch wallet balance
    public function getWalletBalance(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();
        // 0=pending = credit , 1=active = debit
        $pendingAmount = FundRequest::where('user_id', $user->id)
            ->where('status', 0)
            ->sum('amount');

        $approvedAmount = FundRequest::where('user_id', $user->id)
            ->where('status', 1)
            ->sum('amount');

        return response()->json([
            'credit' => $pendingAmount,
            'debit' => $approvedAmount
        ]);
    }
}