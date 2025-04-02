<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AddAccount; 
use Illuminate\Support\Facades\Storage;

class AccountController extends Controller
{
    public function create()
    {
        // Fetch all existing accounts
        //for whitlisting a/c of user
        $accounts = AddAccount::all()->toArray();
        
        // Pass accounts to the frontend
        return Inertia::render('AddAccount', [
            'initialAccounts' => $accounts
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'bank' => 'required|string',
            'account_name' => 'required|string',
            'account_number' => 'required|string', 
            'confirm_account_number' => 'required|string|same:account_number',
            'ifsc_code' => 'required|string',
            'status' => 'nullable|integer', 
        ]);

        $account = AddAccount::create([
            'bank' => $request->bank,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
            'confirm_account_number' => $request->confirm_account_number,
            'ifsc_code' => $request->ifsc_code,
            'status' => 0,
            'userid' => auth()->id()
        ]);

        return redirect()->back()->with('Success', 'Account Details successfully saved');
    }
}