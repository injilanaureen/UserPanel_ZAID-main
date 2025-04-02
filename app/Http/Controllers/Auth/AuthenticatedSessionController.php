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

    public function store(LoginRequest $request): RedirectResponse|Response
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $request->session()->regenerate();
            
            // Set application timezone to ensure consistency
            config(['app.timezone' => 'Asia/Kolkata']);
            
            // Insert directly using DB facade to avoid model casting issues
            DB::table('login_sessions')->insert([
                'user_id'      => Auth::id(),
                'ip_address'   => $request->ip(),
                'user_agent'   => $_SERVER['HTTP_USER_AGENT'] ?? '',
                'gps_location' => $request->gps_location ?? null,
                'ip_location'  => $request->ip_location ?? null,
                'device_id'    => $request->device_id ?? null,
                'login_at'     => Carbon::now('Asia/Kolkata')->format('Y-m-d H:i:s'),
                'created_at'   => Carbon::now('Asia/Kolkata'),
                'updated_at'   => Carbon::now('Asia/Kolkata')
            ]);
            
            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return response()->json(['status' => 'Something went wrong, please contact administrator'], 400);
        }
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
