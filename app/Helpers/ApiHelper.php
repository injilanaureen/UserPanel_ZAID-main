<?php

namespace App\Helpers;

use App\Models\ApiManagement;
use App\Http\Controllers\Jwt;
use App\Models\FundRequest;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ApiHelper
{
    /**
     * Generate a unique request ID.
     *
     * @return string
     */
    public static function generateRequestId()
    {
        return time() . rand(1000, 9999);
    }

    /**
     * Prepare API headers with a JWT token and optional additional headers.
     *
     * @param string $jwtToken
     * @param array $additionalHeaders
     * @param string $partnerId
     * @return array
     */
    public static function getApiHeaders($jwtToken, $additionalHeaders = [], $partnerId = 'PS005962')
    {
        return array_merge([
            'Token' => $jwtToken,
            'accept' => 'application/json',
            'Content-Type' => 'application/json',
            'User-Agent' => $partnerId
        ], $additionalHeaders);
    }

    /**
     * Generate a JWT token.
     *
     * @param string $requestId
     * @param string $partnerId
     * @param string $secretKey
     * @return string
     */
    public static function generateJwtToken($requestId, $partnerId, $secretKey)
    {
        $timestamp = time();
        $payload = [
            'timestamp' => $timestamp,
            'partnerId' => $partnerId,
            'reqid' => $requestId
        ];

        return Jwt::encode(
            $payload,
            $secretKey,
            'HS256'
        );
    }

    /**
     * Generate a unique reference ID.
     *
     * @param string $prefix
     * @return string
     */
    public static function generateReferenceId($prefix = 'RECH')
    {
        return $prefix . time() . rand(1000, 9999);
    }

    /**
     * Fetch API URL from the database based on API name.
     *
     * @param string $apiName
     * @return string|null
     * @throws \Exception
     */
    public static function getApiUrl($apiName)
    {
        $apiDetails = ApiManagement::where('api_name', $apiName)->first();

        if (!$apiDetails) {
            throw new \Exception("API not found for name: {$apiName}");
        }

        return $apiDetails->api_url;
    }
    public static function calculations($userId, $amount, $referenceId)
    {
        try {
            return DB::transaction(function () use ($userId, $amount, $referenceId) {
                // Find the latest approved fund request for the user
                $latestFundRequest = FundRequest::where('user_id', $userId)
                    ->where('status', 1)
                    ->orderBy('created_at', 'desc')
                    ->first();

                if (!$latestFundRequest) {
                    throw new \Exception('No approved fund request found');
                }

                // Calculate new balance
                $currentBalance = $latestFundRequest->amount;
                $newBalance = max(0, $currentBalance - $amount);

                // Update the fund request
                $latestFundRequest->update([
                    'amount' => $newBalance
                ]);

                // Create a transaction record
                Transaction::create([
                    'user_id' => $userId,
                    'amount' => $amount,
                    'type' => 'debit',
                    'status' => 'completed',
                    'description' => 'Recharge transaction - ' . $referenceId
                ]);

                return true;
            });
        } catch (\Exception $e) {
            Log::error('Wallet calculation failed: ' . $e->getMessage());
            return false;
        }
    }
   
}