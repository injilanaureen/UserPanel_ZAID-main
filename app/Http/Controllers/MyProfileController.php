<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MyProfileController extends Controller
{
    public function show()
    {
        return inertia('Profile');
    }
}
