<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\FundRequest;
class AdminController extends Controller
{
    public function dashboard(Request $request)
    { 
        // Get the authenticated user
        $user = $request->user();

        // Calculate pending (status 0) and approved (status 1) amounts
        $pendingAmount = FundRequest::where('user_id', $user->id)
            ->where('status', 0)
            ->sum('amount');
        
        $approvedAmount = FundRequest::where('user_id', $user->id)
            ->where('status', 1)
            ->sum('amount');

        return Inertia::render('Admin/Dashboard', [
            'walletBalance' => [
                'credit' => $pendingAmount,
                'debit' => $approvedAmount
            ]
        ]);
    }   
}