<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RechargeController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\BusTicketController;
use App\Http\Controllers\Remitter2Controller;
use App\Http\Controllers\InsurancePremiumPaymentController;
use App\Http\Controllers\DMTBank1Controller;
use App\Http\Controllers\Beneficiary2Controller;
use App\Http\Controllers\Transaction2Controller;
use App\Http\Controllers\LPGController;
use App\Http\Controllers\Refund2Controller;
use App\Http\Controllers\UtilitybillPaymentController;
use App\Http\Controllers\FastagRechargeController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\AirtelController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\BillPaymentController;
use App\Http\Controllers\LICEnquiryController;
use App\Http\Controllers\CMSAirtelController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [AuthenticatedSessionController::class, 'register'])
        ->name('register');
    Route::post('register', [AuthenticatedSessionController::class, 'storeRegister']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
        
    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])
            ->name('dashboard');
            
        // Recharge Routes
        Route::prefix('recharge')->group(function () {
            Route::get('/dorecharge', [RechargeController::class, 'dorecharge']);
            Route::post('/process', [RechargeController::class, 'processRecharge']);
            
            Route::get('/transactions', [RechargeController::class, 'getTransactions']);

            Route::get('/recharge2', [RechargeController::class, 'recharge2']);
            Route::post('/status', [RechargeController::class, 'fetchRechargeStatus']);
            Route::get('/manage-operator', [RechargeController::class, 'manageOperator']);
        });
        Route::get('/recharge/get-operators', [RechargeController::class, 'getOperators'])->name('admin.recharge.get-operators');
    });
});





Route::post('/recharge/update', [RechargeController::class, 'updateTransaction']);

// Recharge Operator Routes
Route::group(['prefix' => 'recharge'], function () {
    Route::get('/operators', [RechargeController::class, 'operators'])->name('recharge.operators');
    Route::get('/operators/list', [RechargeController::class, 'listRechargeOperators']);
    Route::post('/operators', [RechargeController::class, 'storeRechargeOperator']);
    Route::put('/operators/{id}', [RechargeController::class, 'updateRechargeOperator']);
    Route::delete('/operators/{id}', [RechargeController::class, 'deleteRechargeOperator']);
});
Route::get('/admin/recharge/onboarding', [OnboardingController::class, 'index'])->name('admin.onboarding');
Route::post('/admin/recharge/onboarding', [OnboardingController::class, 'store'])->name('admin.onboarding.store');


//Bus Ticket
Route::group(['prefix' => 'admin/busTicket'], function () {
    //source city
    Route::get('/getSourceCity', [BusTicketController::class, 'getSourceCity'])->name('busTicket.getSourceCity');
    Route::post('/fetchSourceCities', [BusTicketController::class, 'fetchSourceCities'])->name('busTicket.fetchSourceCities');
    //Available Trip
    Route::get('/getAvailableTrip', [BusTicketController::class, 'getAvailableTrip'])->name('busTicket.getAvailableTrip');
    Route::post('/fetchAvailableTrips', [BusTicketController::class, 'fetchAndStoreAvailableTrips'])->name('busTicket.fetchAvailableTrips'); 
    //Current available Trip
    Route::get('/getCurrentTripDetails', [BusTicketController::class, 'getCurrentTripDetails'])->name('busTicket.getCurrentTripDetails');
    Route::post('/fetchTripDetails', [BusTicketController::class, 'fetchTripDetails'])->name('busTicket.fetchTripDetails');
    Route::post('/storeTripDetails', [BusTicketController::class, 'storeTripDetails'])->name('busTicket.storeTripDetails');

    //book ticket
    Route::get('/bookTicket', [BusTicketController::class, 'getbookTicket'])->name('busTicket.getAvailableTrip');
    Route::post('/bookticket', [BusTicketController::class, 'bookandstorebookticket'])->name('busTicket.bookandstorebookticket');
    //block ticket
    Route::get('/blockTicket', [BusTicketController::class, 'blockTicket'])->name('busTicket.blockTicket');
    //get boarding point details ...
    Route::get('/getBoardingPointDetails', [BusTicketController::class, 'getboardingpointdetails'])->name('busTicket.getAvailableTrip');
    Route::post('/fetchboardingpointdetails', [BusTicketController::class, 'fetchandstoreboardingpointdetails'])->name('busTicket.fetchandstoreboardingpointdetails');
    //booked tickets
    Route::get('/checkBookedTickets', [BusTicketController::class, 'getcheckBookedTickets'])->name('busTicket.checkBookedTickets');
    Route::post('/fetchBookedTickets', [BusTicketController::class, 'fetchBookedTickets'])->name('busTicket.fetchBookedTickets');
});

//DMT Bank 2 Remitter
Route::get('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query');
Route::post('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query.post');
Route::get('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'showQueryForm'])->name('remitter.query');
Route::post('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query.post');
Route::post('/admin/remitter2/storeRemitter', [Remitter2Controller::class, 'storeRemitterData'])->name('remitter.store');
//Remitter Adhaar verify 
Route::get('/admin/remitter2/remitterAdhaarVerifyApi', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi'])->name('remitter.showRemitterAdhaarVerifyApi');
Route::get('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi']);
Route::post('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar']);

Route::get('/admin/remitter2/registerRemitter', [Remitter2Controller::class, 'showVerificationForm'])
    ->name('admin.remitter2.register');
Route::post('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'registerAdhaarRemitter'])
    ->name('admin.remitter2.verify');
    Route::post('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar'])->name('remitter.adhaar.verify');
    Route::get('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'showVerificationForm'])->name('remitter.adhaar.form');
//Register Remitter
Route::get('/admin/remitter2/registerRemitter', [Remitter2Controller::class, 'registerRemitter'])
    ->name('admin.remitter2.register');
    Route::get('/admin/remitter2/registerRemitter', [Remitter2Controller::class, 'registerRemitter'])
    ->name('admin.remitter2.register');
Route::post('/api/admin/remitter2/register-remitter', [Remitter2Controller::class, 'registerRemitter'])
    ->name('api.admin.remitter2.register');
    Route::get('/admin/remitter2/registrations', [Remitter2Controller::class, 'getRegistrations'])
    ->name('admin.remitter2.registrations');
// Redirect root to dashboard

 
//Beneficiary 
Route::get('/admin/beneficiary2/registerBeneficiary', [Beneficiary2Controller::class, 'registerBeneficiary'])->name('beneficiary2.registerBeneficiary');
Route::match(['get', 'post'], '/beneficiary/register', [Beneficiary2Controller::class, 'registerBeneficiary'])->name('beneficiary.register');
Route::post('/beneficiary/register', [Beneficiary2Controller::class, 'registerBeneficiary']);


Route::get('/admin/beneficiary2/deleteBeneficiary', [Beneficiary2Controller::class, 'deleteBeneficiary'])
    ->name('beneficiary2.deleteBeneficiary');
Route::post('/admin/beneficiary2/deleteBeneficiary', [Beneficiary2Controller::class, 'destroyBeneficiary'])
    ->name('beneficiary2.destroyBeneficiary');
    Route::get('/admin/beneficiary2/deletion-history', [Beneficiary2Controller::class, 'getDeletionHistory'])
    ->name('beneficiary2.getDeletionHistory');


Route::get('/admin/beneficiary2/fetchBeneficiary', [Beneficiary2Controller::class, 'fetchBeneficiary'])->name('beneficiary2.fetchBeneficiary');
Route::get('/admin/beneficiary2/fetch', [Beneficiary2Controller::class, 'fetchBeneficiary'])->name('beneficiary2.fetch');


Route::prefix('admin/beneficiary2')->group(function () {
    Route::get('/fetchbyBenied', [Beneficiary2Controller::class, 'fetchbyBenied'])
        ->name('beneficiary2.fetchbyBenied');
    Route::post('/fetch-beneficiary-data', [Beneficiary2Controller::class, 'fetchBeneficiaryData'])
        ->name('beneficiary2.fetchBeneficiaryData');
});

//Transaction 
Route::get('/admin/transaction2/pennyDrop', [Transaction2Controller::class, 'pennyDrop'])->name('transaction2.pennyDrop');
Route::match(['get', 'post'], '/admin/transaction2/pennyDrop', [Transaction2Controller::class, 'pennyDrop'])->name('transaction2.pennyDrop');

Route::get('/admin/transaction2/transactionSentOtp', [Transaction2Controller::class, 'transactionSentOtp'])->name('transaction2.transactionSentOtp');
Route::match(['get', 'post'], '/transaction-sent-otp', [Transaction2Controller::class, 'transactionSentOtp'])->name('transaction.sent.otp');

Route::get('/admin/transaction2/transaction', [Transaction2Controller::class, 'transaction'])->name('transaction2.transaction');
Route::post('/admin/transaction2/transact', [Transaction2Controller::class, 'transact'])->name('transaction2.transact');

Route::get('/admin/transaction2/transactionStatus', [Transaction2Controller::class, 'transactionStatus'])->name('transaction2.transactionStatus');
Route::post('/transaction-status', [Transaction2Controller::class, 'transactionStatus']);



//Refund
Route::get('/admin/refund2/refundOtp', [Refund2Controller::class, 'refundOtp'])->name('transaction2.refundOtp');
Route::match(['get', 'post'], '/admin/refund2/refundOtp', [Refund2Controller::class, 'refundOtp'])->name('refund2.refundOtp');

// Route::match(['get', 'post'], '/admin/refund2/refundOtp', [Refund2Controller::class, 'refundOtp'])
//     ->name('refund2.refundOtp');
Route::get('/admin/refund2/claimRefund', [Refund2Controller::class, 'claimRefund'])->name('transaction2.claimRefund');
Route::post('/admin/refund2/processRefund', [Refund2Controller::class, 'processRefund'])->name('transaction2.processRefund');

//Utility Bill Payment
Route::get('/admin/utility-bill-payment/operator-list', [UtilitybillPaymentController::class, 'operatorList'])
    ->name('utilitybillPayment.operatorList');
Route::get('/operator-list', [UtilitybillPaymentController::class, 'operatorList'])
    ->name('operator.list');
Route::post('/admin/operator-list', [UtilitybillPaymentController::class, 'operatorList'])
    ->middleware('auth');
    
// This is the route your React component will now call
Route::get('/api/operators', [UtilitybillPaymentController::class, 'fetchOperators']);

Route::post('/admin/get-operators', [UtilitybillPaymentController::class, 'fetchOperators'])
    ->name('admin.get-operators');

//Fetch Bill Details
Route::get('/admin/utility-bill-payment/fetch-bill-details', [UtilitybillPaymentController::class, 'fetchBillDetails'])
    ->name('utilitybillPayment.fetchBillDetails');
Route::match(['get', 'post'], '/admin/utility-bill-payment/fetch-bill-details', [UtilitybillPaymentController::class, 'fetchBillDetails'])
    ->name('utilitybillPayment.fetchBillDetails');

//Pay Bill
Route::get('/admin/utility-bill-payment/pay-bill', [UtilitybillPaymentController::class, 'payBill'])
    ->name('UtilityBillPayment.payBill');
Route::post('/admin/utility-bill-payment/process-bill-payment', [UtilitybillPaymentController::class, 'processBillPayment'])
    ->name('UtilityBillPayment.processBillPayment');
   
//Status Enquiry 

Route::get('/admin/utility-bill-payment/utility-status-enquiry', [UtilitybillPaymentController::class, 'utilityStatusEnquiry'])
    ->name('utilityStatusEnquiry');
Route::post('/admin/utility-bill-payment/fetch-utility-status', [UtilitybillPaymentController::class, 'fetchUtilityStatus'])
    ->name('fetchUtilityStatus');

//Insurance Premium Payment
Route::get('/admin/InsurancePremiumPayment/FetchInsuranceBillDetails', [InsurancePremiumPaymentController::class, 'fetchInsuranceBillDetails'])->name('InsurancePremiumPayment.FetchInsuranceBillDetails'); 

Route::get('/admin/InsurancePremiumPayment/PayInsuranceBill', [InsurancePremiumPaymentController::class, 'payInsuranceBill'])->name('InsurancePremiumPayment.PayInsuranceBill'); 
Route::get('/pay-insurance-bill', [InsurancePremiumPaymentController::class, 'payInsuranceBill']);
Route::match(['get', 'post'], '/pay-insurance-bill', [InsurancePremiumPaymentController::class, 'payInsuranceBill']);

Route::get('/admin/InsurancePremiumPayment/FetchInsuranceBillDetails', [InsurancePremiumPaymentController::class, 'fetchInsuranceBillDetails'])->name('InsurancePremiumPayment.FetchInsuranceBillDetails');
Route::post('/admin/InsurancePremiumPayment/fetch-lic-bill', [InsurancePremiumPaymentController::class, 'fetchLICBill'])->name('InsurancePremiumPayment.fetchLICBill');

Route::get('/admin/InsurancePremiumPayment/InsuranceStatusEnquiry',[InsurancePremiumPaymentController::class,'insuranceStatusEnquiry'])->name('InsurancePremiumPayment.InsuranceStatusEnquiry');
Route::post('/admin/InsurancePremiumPayment/fetchInsuranceStatus', [InsurancePremiumPaymentController::class, 'fetchInsuranceStatus'])->name('InsurancePremiumPayment.fetchInsuranceStatus');

//Fastag Recharge
//operator
Route::get('/admin/FastagRecharge/FastagOperatorList',[FastagRechargeController::class,'fastagRechargeOperatorList'])->name('FastagRecharge.FastagOperatorList');
Route::get('/admin/fastag-operators', [FastagController::class, 'fastagRechargeOperatorList'])->name('admin.fastag-operators');

//consumer details 
Route::get('/admin/FastagRecharge/fetchConsumerDetails',[FastagRechargeController::class,'fetchConsumerDetails'])->name('FastagRecharge.FastagFetchConsumerDetails');
Route::post('/api/fetchConsumerDetails', [FastagRechargeController::class, 'getConsumerDetails'])->name('FastagRecharge.getConsumerDetails');
//recharge
Route::get('/admin/FastagRecharge/fastagRecharge',[FastagRechargeController::class,'FastagRecharge'])->name('FastagRecharge.FastagRecharge');

//status
Route::get('/admin/FastagRecharge/FastagStatus',[FastagRechargeController::class,'FastagStatus'])->name('FastagRecharge.FastagStatus');
//LPG
Route::prefix('admin')->group(function () {
    Route::get('LPG/LPGOperator', [LPGController::class, 'LPGOperator'])->name('LPG.LPGOperator');
});


Route::post('api/fetch-lpg-operator', [LPGController::class, 'fetchLPGOperator']);
//fetch lpg details
Route::get('/admin/LPG/LPGDetails',[LPGController::class,'FetchLPGDetails'])->name('LPG.FetchLPGDetails');
Route::match(['get', 'post'], '/admin/LPG/FetchLPGDetails', [LPGController::class, 'FetchLPGDetails'])->name('LPG.FetchLPGDetails');
//lpg
Route::get('/admin/LPG/LPGBill',[LPGController::class,'LPGBill'])->name('LPG.LPGBill');
Route::post('/pay-lpg-bill', [LPGController::class, 'payLpgBill']);
Route::get('/lpg-bill-history', [LPGController::class, 'getLpgBillHistory']);

//status
Route::get('/admin/LPG/LPGStatus', [LPGController::class, 'LPGStatus'])->name('LPG.LPGStatus');
Route::post('/lpg-status', [LPGController::class, 'getLPGStatus']);

//test
Route::get('/admin/LPG/Test', [LPGController::class, 'Test'])->name('LPG.Test');
//Municipality

//operator
Route::get('/admin/Municipality/MunicipalityOperator', [MunicipalityController::class, 'MunicipalityOperator'])->name('Municipality.MunicipalityOperator');
Route::get('/municipality/operator', [MunicipalityController::class, 'showMunicipalityOperator'])->name('municipality.operator');// only to fetch operators data from databse
Route::post('/municipality/fetch', [MunicipalityController::class, 'fetchMunicipalityOperator'])->name('municipality.fetch');//used to fetch from api
Route::post('/municipality/save', [MunicipalityController::class, 'store']);// use to stor fetched opertor from api to databse




//fetch municipality details
Route::get('/admin/Municipality/FetchMunicipalityDetails', [MunicipalityController::class, 'FetchMunicipalityDetails'])->name('Municipality.FetchMunicipalityDetails');
Route::post('/api/municipality/fetch-bill', [MunicipalityController::class, 'fetchBillDetails']);
Route::post('/municipality/save-bill', [MunicipalityController::class, 'storeBillDetails'])->name('municipality.save-bill');


//Pay Bill
Route::get('/admin/Municipality/MunicipalityBill', [MunicipalityController::class, 'showMunicipalityBill'])->name('Municipality.MunicipalityBill');
Route::post('/api/Municipality/pay-bill', [MunicipalityController::class, 'PayMunicipalityBill'])->name('Municipality.MunicipalityPayBill');


//Status
Route::get('/admin/Municipality/MunicipalityStatus', [MunicipalityController::class, 'MunicipalityStatus'])->name('Municipality.MunicipalityStatus');
Route::post('/api/Municipality/MunicipalityStatus', [MunicipalityController::class, 'MunicipalityEnquiryStatus'])->name('Municipality.MunicipalityEnquiryStatus');

//DMT BANK1
//query remitter
Route::get('/admin/remitter1/queryRemitter', [DMTBank1Controller::class, 'QueryRemitter'])->name('remitter1.queryRemitter');
Route::post('/query-remitter', [DMTBank1Controller::class, 'fetchQueryRemitter']);
//Remitter E-KYC API
Route::get('/admin/remitter1/remitterEKYC',[DMTBank1Controller::class,'Remitter1EKYC'])->name('remitter1.remitterE-KYC');
Route::post('ekyc_remitter1', [DMTBank1Controller::class, 'ekyc_remitter1'])->name('remitter1.ekyc_remitter1');


//Register Remitter
Route::get('/admin/remitter1/registerRemitter',[DMTBank1Controller::class,'RegisterRemitter'])->name('remitter1.registerRemitter');
Route::post('/register-remitter1', [DMTBank1Controller::class, 'processRegisterRemitter'])->name('remitter1.processRegisterRemitter');
Route::post('/store_register-remitter1', [DMTBank1Controller::class, 'storeRegisterRemitter1'])->name('remitter1.storeRegisterRemitter');

//Beneficiary

//Register Beneficiary
Route::get('/admin/beneficiary1/registerBeneficiary',[DMTBank1Controller::class,'RegisterBeneficiary'])->name('register-beneficiary');
Route::post('/register-beneficiary', [DMTBank1Controller::class, 'storeBeneficiary'])->name('store-beneficiary');

//Delete Beneficiary
Route::get('/admin/beneficiary1/deleteBeneficiary',[DMTBank1Controller::class,'deleteBeneficiary'])->name('register.deleteBeneficiary');
Route::post('/deleteBeneficiary',[DMTBank1Controller::class,'deleteBeneficiaryAccount'])->name('beneficiary1.deleteBeneficiary');

//Fetch Beneficiary
Route::get('/admin/beneficiary1/FetchBeneficiary', [DMTBank1Controller::class, 'fetchBeneficiary'])->name('register.fetchBeneficiary');
Route::get('/admin/beneficiary/fetch', [DMTBank1Controller::class, 'fetchBeneficiary'])->name('admin.beneficiary.fetch');
Route::match(['GET', 'POST'], '/admin/beneficiary/fetch', [DMTBank1Controller::class, 'fetchBeneficiary'])->name('admin.beneficiary.fetch');

Route::get('/admin/beneficiary1/FetchBeneficiaryByBenied', [DMTBank1Controller::class, 'fetchBeneficiaryByBenied'])->name('register.fetchBeneficiaryByBenied');
Route::post('/admin/beneficiary/fetch-by-beneid', [DMTBank1Controller::class, 'fetchBeneficiaryByBeneIdshow'])->name('admin.beneficiary.fetchByBeneId');


//Penny Drop
Route::get('/admin/transaction1/pennyDrop', [DMTBank1Controller::class, 'pennyDrop'])->name('register.PennyDrop');
Route::post('/penny-drop', [DMTBank1Controller::class, 'processPennyDrop'])->name('register.processPennyDrop');
//transaction
Route::get('admin/transaction1/transaction', [DMTBank1Controller::class, 'transaction1'])->name('register.transaction1');
Route::post('/transaction1', [DMTBank1Controller::class, 'processtransaction1'])->name('register.processtransaction1');

//transaction sent-otp
Route::get('/admin/transaction1/transactionOtp', [DMTBank1Controller::class, 'transactionOtp'])->name('register.transactionOtp');
Route::post('/transaction1OTP', [DMTBank1Controller::class, 'processtransaction1Otp'])->name('register.processtransaction1OTP');
Route::redirect('/', '/admin/dashboard');

//transaction status
Route::get('/admin/transaction1/transactionStatus', [DMTBank1Controller::class, 'transactionStatus'])->name('register.transactionStatus');
Route::post('/processTransaction1Status', [DMTBank1Controller::class, 'processTransaction1Status'])->name('process.processTransaction1Status');

//refund
Route::get('/admin/refund1/refundOtp', [DMTBank1Controller::class, 'refundOTP'])->name('register.refundOTP');
Route::post('/processrefundOTP', [DMTBank1Controller::class, 'processrefundOTP'])->name('process.refundStatus');

Route::get('/admin/refund1/claimRefund', [DMTBank1Controller::class, 'claimRefund'])->name('registerclaimRefund');
Route::post('/claimRefund', [DMTBank1Controller::class, 'processclaimRefund'])->name('process.claimRefund');


// save lic bill fetch 

    Route::get('/admin/lic', [LICEnquiryController::class, 'licapi']);
    Route::post('/save-bill-payment', [BillPaymentController::class, 'store']);
    Route::post('/save-bill', [BillController::class, 'store']);
    Route::post('/save-lic-status', [LICEnquiryController::class, 'store']);

    Route::prefix('/cms')->group(function () {
    Route::get('/airtel', [AirtelController::class, 'generate'])->name('airtel');
    Route::post('/airtel', [AirtelController::class, 'process'])->name('airtel.post'); //payment
    Route::post('/airtel/check-status', [AirtelController::class, 'check'])->name('airtel.check-status');  //enquiry 
  
// routes/web.php
Route::get('/get-csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});


//cms airtel 


});

Route::get('/admin/cmsairtel/GenerateUrl',[CMSAirtelController::class,'generateUrl']);
Route::post('/cms/airtel/store', [CMSAirtelController::class, 'store']);
Route::get('/admin/cmsairtel/AirtelTransactionEnquiry',[CMSAirtelController::class,'AirtelTransactionEnquiry']);
Route::get('/admin/airtel-transaction-enquiry', [CMSAirtelController::class, 'airtelTransactionEnquiry'])->name('admin.airtel.transaction.enquiry');
    Route::post('/admin/get-bill-operators', [CMSAirtelController::class, 'getBillOperators'])->name('admin.get.bill.operators');