<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LocationCapture
{
    public function handle($request, Closure $next)
    {
        $iplocation = DB::table("ip_locations")->where('ip', $request->ip())->first();
        
        if ($iplocation) {
            $lat = $iplocation->lat;
            $lon = $iplocation->lon;
        } else {
            try {
                $url = "http://ip-api.com/json/" . $request->ip();
                $response = Http::get($url)->json();
                
                if (isset($response['lat'])) {
                    $lat = $response['lat'];
                    $lon = $response['lon'];
                    
                    try {
                        DB::table("ip_locations")->insert([
                            "ip"  => $request->ip(),
                            "lat" => $lat,
                            "lon" => $lon
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Failed to save IP location: ' . $e->getMessage());
                    }
                } else {
                    $lat = 28.4597; // Default latitude
                    $lon = 77.0282; // Default longitude
                }
            } catch (\Exception $e) {
                Log::error('IP location lookup failed: ' . $e->getMessage());
                $lat = 28.4597; // Default latitude
                $lon = 77.0282; // Default longitude
            }
        }
        
        // Check if GPS location is provided
        if ($request->has("gps_location") && $request->gps_location != "") {
            $gpsdata = explode("/", $request->gps_location);
            if (count($gpsdata) >= 2) {
                $lat = $gpsdata[0];
                $lon = $gpsdata[1];
            }
        }
        
        // Set lat/lon in the request
        $request->merge([
            'latitude' => $lat,
            'longitude' => $lon,
        ]);
        
        return $next($request);
    }
}