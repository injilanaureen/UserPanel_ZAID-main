<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class IPWhitelist extends Controller
{
    public function IPWhitelist()
    {
        $whitelistedIps = DB::table('whitelisted_ips')
            ->where('user_id', Auth::id())
            ->select('ip_address', 'status')
            ->get()
            ->map(function ($ip) {
                return [
                    'address' => $ip->ip_address,
                    'status' => $ip->status // 0 = pending, 1 = approved
                ];
            })
            ->toArray();

        $currentIp = request()->ip();

        return Inertia::render('Admin/ipwhitelist/ipwhitelist', [
            'initialIps' => $whitelistedIps,
            'currentIp' => $currentIp
        ]);
    }

    public function updateWhitelist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ips' => 'required|array',
            'ips.*.address' => 'required|ip',
            'ips.*.status' => 'required|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid IP format or status',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::table('whitelisted_ips')
            ->where('user_id', Auth::id())
            ->delete();

        $ips = $request->input('ips');
        foreach ($ips as $ip) {
            DB::table('whitelisted_ips')->insert([
                'ip_address' => $ip['address'],
                'user_id' => Auth::id(),
                'status' => $ip['status'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'IP whitelist updated successfully'
        ]);
    }

    public function checkAndWhitelistIP(Request $request)
    {
        $currentIp = $request->ip();
        $userId = Auth::id();

        $whitelistEntry = DB::table('whitelisted_ips')
            ->where('user_id', $userId)
            ->where('ip_address', $currentIp)
            ->first();

        if ($whitelistEntry && $whitelistEntry->status == 1) {
            return response()->json([
                'status' => 'success',
                'message' => 'IP is already approved',
                'ip' => $currentIp
            ]);
        }

        if ($request->input('whitelist', false)) {
            $validator = Validator::make(['ip' => $currentIp], [
                'ip' => 'required|ip'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid IP address',
                    'errors' => $validator->errors()
                ], 422);
            }

            if ($whitelistEntry) {
                // Update existing entry to approved
                DB::table('whitelisted_ips')
                    ->where('user_id', $userId)
                    ->where('ip_address', $currentIp)
                    ->update(['status' => 1, 'updated_at' => now()]);
            } else {
                // Insert new entry with pending status (0) by default
                DB::table('whitelisted_ips')->insert([
                    'ip_address' => $currentIp,
                    'user_id' => $userId,
                    'status' => 0,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            return response()->json([
                'status' => 'pending',
                'message' => 'IP has been added as pending',
                'ip' => $currentIp
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Access denied: Your IP is not whitelisted.',
            'ip' => $currentIp
        ], 403);
    }
    public function deleteIp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ip_address' => 'required|ip'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid IP address format',
                'errors' => $validator->errors()
            ], 422);
        }

        $ipAddress = $request->input('ip_address');
        $userId = Auth::id();

        $deleted = DB::table('whitelisted_ips')
            ->where('user_id', $userId)
            ->where('ip_address', $ipAddress)
            ->delete();

        if ($deleted) {
            return response()->json([
                'status' => 'success',
                'message' => 'IP address deleted successfully',
                'ip' => $ipAddress
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'IP address not found in whitelist',
            'ip' => $ipAddress
        ], 404);
    }
    
}