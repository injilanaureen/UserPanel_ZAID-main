<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    // public function recharge1()
    // {
    //     return Inertia::render('Admin/Recharge/Recharge1');
    // }

    // public function recharge2()
    // {
    //     return Inertia::render('Admin/Recharge/Recharge2');
    // }
    // public function ManageOperator()
    // {
    //     return Inertia::render('Admin/Recharge/ManageOperator');
    // }
}