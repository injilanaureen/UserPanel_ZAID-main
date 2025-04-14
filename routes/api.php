<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\RechargeController;
use App\Http\Controllers\PaysprintCallbackController;
use App\Http\Controllers\BusTicketController;
use App\Http\Controllers\CMSAirtelController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Http;
use Firebase\JWT\JWT;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');


Route::get('/test-api', [ApiController::class, 'index']);

Route::post('/recharge/status-enquiry', [RechargeController::class, 'storeStatusEnquiry']);

Route::get('/fastag-operators', [FastagController::class, 'getOperators']);

Route::prefix('recharge')->group(function () {
    Route::post('/status', [RechargeController::class, 'fetchRechargeStatus']);
});

Route::post('/busbookingcallback', [PaysprintCallbackController::class, 'handleCallback']);
Route::post('/bus/block-ticket', [BusTicketController::class, 'blockTicketApi']);

Route::post('/cancel-bus-ticket', [BusTicketController::class, 'cancelTicket']);


// In api.php
// Route::middleware('api')->group(function () {
//     Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
//     Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
//     Route::get('/register', [AuthenticatedSessionController::class, 'register'])->name('register');
//     Route::post('/register', [AuthenticatedSessionController::class, 'storeRegister'])->name('register.store');
// });