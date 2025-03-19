<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\RechargeController;
use App\Http\Controllers\PaysprintCallbackController;
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

Route::post('/busbookingcallback', [PaysprintCallbackController::class, 'handleCallback']);