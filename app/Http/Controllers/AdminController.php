<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Jwt; 
use Illuminate\Support\Facades\Http;
class AdminController extends Controller
{
    private $partnerId = 'PS005962'; 
    private $secretKey = 'UFMwMDU5NjJjYzE5Y2JlYWY1OGRiZjE2ZGI3NThhN2FjNDFiNTI3YTE3NDA2NDkxMzM=';

    private function generateJwtToken($requestId)
    {
        $timestamp = time();
        $payload = [
            'timestamp' => $timestamp,
            'partnerId' => $this->partnerId,
            'reqid' => $requestId
        ];

        return Jwt::encode($payload, $this->secretKey, 'HS256');
    }

    public function dashboard()
    {
        
        return Inertia::render('Admin/Dashboard');
    }
    public function getWalletBalance()
    {
        $requestId = time() . rand(1000, 9999);
        $jwtToken = $this->generateJwtToken($requestId);
        
        try {
            $response = Http::withHeaders([
                'Token' => $jwtToken,
                'User-Agent' => $this->partnerId,
                'accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post('https://api.paysprint.in/api/v1/service/balance/balance/cashbalance');
            
            return response()->json([
                'success' => true,
                'balance' => $response->json('cdwallet') ?? 0
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    
}