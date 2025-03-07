<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\lic_enquiries;
use Inertia\Inertia;


class LICEnquiryController extends Controller
{
    public function licapi()
    {
        return Inertia::render('Admin/api/licapi'); 
    }
 
    public function store(Request $request)
    {
        try {
            $data = $request->all();

            $licEnquiry = lic_enquiries::create([
                'ad1' => $data['ad1'],
                'ad2' => $data['ad2'],
                'ad3' => $data['ad3'],
                'amount' => $data['amount'],
                'canumber' => $data['canumber'],
                'comm' => $data['comm'],
                'dateadded' => $data['dateadded'],
                'daterefunded' => $data['daterefunded'],
                'operatorid' => $data['operatorid'],
                'operatorname' => $data['operatorname'],
                'refid' => $data['refid'],
                'refunded' => $data['refunded'],
                'refundtxnid' => $data['refundtxnid'],
                'status' => $data['status'],
                'tds' => $data['tds'],
                'txnid' => $data['txnid'],
            ]);

            return response()->json(['success' => true, 'message' => 'Data saved successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to save data', 'error' => $e->getMessage()], 500);
        }
    }
}
