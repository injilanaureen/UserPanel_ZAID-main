<?php

namespace App\Http\Controllers;
use App\Models\OnboardingForm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OnboardingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Recharge/OnboardingForm');
    }

    public function store(Request $request)
    {
        $request->validate([
            'merchantcode' => 'required|string',
            'mobile' => 'required|string|size:10',
            'is_new' => 'required|boolean',
            'email' => 'required|email',
            'firm' => 'required|string',
            'aadhaarFront' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'aadhaarBack' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'panCard' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        $data = $request->only(['merchantcode', 'mobile', 'is_new', 'email', 'firm']);

        // Handle file uploads
        if ($request->hasFile('aadhaarFront')) {
            $data['aadhaarFront'] = $request->file('aadhaarFront')->store('documents', 'public');
        }
        if ($request->hasFile('aadhaarBack')) {
            $data['aadhaarBack'] = $request->file('aadhaarBack')->store('documents', 'public');
        }
        if ($request->hasFile('panCard')) {
            $data['panCard'] = $request->file('panCard')->store('documents', 'public');
        }

        try {
            $onboarding = OnboardingForm::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Onboarding form submitted successfully',
                'data' => $onboarding
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to submit onboarding form',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}