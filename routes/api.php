<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\RechargeController;
use Illuminate\Support\Facades\Http;
use Firebase\JWT\JWT;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test-api', [ApiController::class, 'index']);

Route::post('/recharge/status-enquiry', [RechargeController::class, 'storeStatusEnquiry']);

Route::get('/fastag-operators', [FastagController::class, 'getOperators']);

Route::prefix('recharge')->group(function () {
    Route::post('/status', [RechargeController::class, 'fetchRechargeStatus']);
});

Route::post('/proxy/wallet-balance', function (Request $request) {
    $response = Http::withHeaders([
        'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDIyNzYzODEsInBhcnRuZXJJZCI6IlBTMDA1OTYyIiwicmVxaWQiOiIxNzQyMjc2MzgxICAgIn0.-oqTdf3CqHB5ToCMgXSD-C4MLHyq0FiGjjaa5_Eox5s',
        'accept' => 'application/json',
        'Content-Type' => 'application/json',
    ])->post('https://api.paysprint.in/api/v1/service/balance/balance/cashbalance');
    
    return $response->json();
});