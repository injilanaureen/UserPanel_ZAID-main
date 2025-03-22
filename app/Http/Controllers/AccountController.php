<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AccountController extends Controller
{
    public function create()
{
    return Inertia::render('AddAccount');
}
}
