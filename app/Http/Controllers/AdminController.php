<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\FundRequest;
use App\Models\Transaction;
use App\Models\LogSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AdminController extends Controller {

    public function loginpage()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'device_id' => 'nullable|string',
            'gps_location' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'ERR',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check credentials
        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json([
                'status' => 'ERR', 
                'message' => 'Email or password is incorrect'
            ], 401);
        }

        $user = Auth::user();
        
        // Log the session
        $this->logUserSession($request, $user->id);

        // Generate session
        $request->session()->regenerate();

        return response()->json([
            'status' => 'OK',
            'message' => 'Login successfull',
            'redirect' => route('admin.dashboard')
        ]);
    }

    private function logUserSession(Request $request, $userId)
    {
        // Get IP location using IP-API (optional - can be implemented)
        $ipLocation = null;
        
        try {
            $ipData = Http::get("http://ip-api.com/json/" . $request->ip())->json();
            if (isset($ipData['lat']) && isset($ipData['lon'])) {
                $ipLocation = $ipData['lat'] . ',' . $ipData['lon'];
            }
        } catch (\Exception $e) {
            // Silent fail if IP geolocation service is unavailable
        }

        // Create login session record
        LogSession::create([
            'user_id' => $userId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'gps_location' => $request->gps_location,
            'ip_location' => $ipLocation,
            'device_id' => $request->device_id
        ]);
    }

    public function dashboard(Request $request)
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('login');
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