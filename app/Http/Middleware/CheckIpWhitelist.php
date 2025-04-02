<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckIpWhitelist
{
    public function handle(Request $request, Closure $next)
    {
        $currentIp = $request->ip();
        $userId = Auth::id();

        if (!$userId) {
            return $next($request); // Let auth middleware handle unauthenticated users
        }

        $whitelistEntry = DB::table('whitelisted_ips')
            ->where('user_id', $userId)
            ->where('ip_address', $currentIp)
            ->first();

        if (!$whitelistEntry || $whitelistEntry->status == 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Access denied: Your IP is not whitelisted.',
                'ip' => $currentIp
            ], 403);
        }

        // If we reach here, status is 1 (approved)
        return $next($request);
    }
}