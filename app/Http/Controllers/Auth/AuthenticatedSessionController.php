<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\LastLogin;
use App\Models\LogSession;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

use Carbon\Carbon;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(Request $request)
    {
        // if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
        //     $request->session()->regenerate();
            
        //     // Ensure timezone consistency
        //     config(['app.timezone' => 'Asia/Kolkata']);

        //     // Store login session details
        //     DB::table('login_sessions')->insert([
        //         'user_id'      => Auth::id(),
        //         'ip_address'   => $request->ip(),
        //         'user_agent'   => $request->header('User-Agent', ''),
        //         'gps_location' => $request->gps_location ?? null,
        //         'ip_location'  => $request->ip_location ?? null,
        //         'device_id'    => $request->device_id ?? null,
        //         'login_at'     => Carbon::now('Asia/Kolkata')->format('Y-m-d H:i:s'),
        //         'created_at'   => Carbon::now('Asia/Kolkata'),
        //         'updated_at'   => Carbon::now('Asia/Kolkata')
        //     ]);

        //     //   return redirect()->intended(route('dashboard', absolute: false));
        // } 
        return response()->json([
            'status'  => 200,
            'message' => 'success',
        ], 401);
        
        // return response()->json([
        //     'status'  => 'error',
        //     'message' => 'Invalid credentials',
        // ], 401);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
