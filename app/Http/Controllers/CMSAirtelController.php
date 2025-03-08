<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class CMSAirtelController extends Controller
{
    public function generateUrl()
    {
        // API call to fetch Airtel CMS data
        $url = "https://sit.paysprint.in/service-api/api/v1/service/airtelcms/V2/airtel/index";
        $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3NDEzNDk2MzAsInBhcnRuZXJJZCI6IlBTMDA1OTYyIiwicmVxaWQiOiIxNzQxMzQ5NjMwICJ9.XDf0Oc7lRKY6042VAmm_E916_9TzBNzAjE2EzccSdzY";
    
        // Hardcoded latitude and longitude
        $latitude = "28.6139";  // Example: New Delhi
        $longitude = "77.2090";
    
        // Pass hardcoded values to Inertia view
        return Inertia::render('Admin/cmsairtel/GenerateUrl', [
            'latitude' => $latitude,
            'longitude' => $longitude
        ]);
    }
    

    public function airtelTransactionEnquiry(){
        return Inertia::render('Admin/cmsairtel/AirtelTransactionEnquiry');
    }
}
