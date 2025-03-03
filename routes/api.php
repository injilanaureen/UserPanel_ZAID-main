<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test-api', [ApiController::class, 'index']);

Route::post('/recharge/status-enquiry', [RechargeController::class, 'storeStatusEnquiry']);