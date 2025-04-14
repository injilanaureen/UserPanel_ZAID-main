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
    use App\Http\Controllers\MyProfileController;
    use App\Http\Controllers\AccountController;
    use App\Http\Controllers\FundController;
    use App\Http\Controllers\DashboardController;
    use App\Http\Controllers\IPWhitelist;
    use App\Http\Controllers\HLRController;
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;

    Route::get('/', [AdminController::class, 'loginpage'])->middleware('guest')->name('mylogin');
    Route::get('login', [AdminController::class, 'loginpage'])->middleware('guest');

    // Authentication Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::post('check', [AdminController::class, 'login'])->name('authCheck');
    });

    Route::middleware('auth')->group(function () {
        Route::get('admin/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        // Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        // Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout.post');
        //IP Whitelist Management Route (accesible without check )
        Route::middleware(['auth'])->group(function () {
            Route::get('/ip-whitelist', [IPWhitelist::class, 'IPWhitelist'])->name('ip.whitelist');
            Route::post('/check-ip', [IPWhitelist::class, 'checkAndWhitelistIP']);
            Route::post('/update-whitelist', [IPWhitelist::class, 'updateWhitelist']);
            Route::delete('/whitelist/ip', [IPWhitelist::class, 'deleteIp']);
        });

        // Admin Routes protected by IP Whitelist
        Route::prefix('admin')->group(function () {
            // Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
            Route::get('/admin/profile', [MyProfileController::class, 'show'])->name('admin.profile');

            // Recharge Routes
            Route::prefix('recharge')->group(function () {
                Route::get('/dorecharge', [RechargeController::class, 'dorecharge']);
                Route::post('/process', [RechargeController::class, 'processRecharge'])->middleware('check.balance');

                Route::get('/transactions', [RechargeController::class, 'getTransactions']);

                Route::get('/recharge2', [RechargeController::class, 'recharge2']);
                Route::post('/status', [RechargeController::class, 'fetchRechargeStatus']);
                Route::get('/manage-operator', [RechargeController::class, 'manageOperator']);
            });
            Route::get('/recharge/get-operators', [RechargeController::class, 'getOperators'])->name('admin.recharge.get-operators');
            // Route involving spending (apply CheckUserBalance middleware)
            Route::post('/process', [RechargeController::class, 'processRecharge'])
                ->middleware('checkBalance');
        });
    });
    Route::get('/rechargetransactions', [RechargeController::class, 'getRechargeTransactions']);
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
        Route::post('/block-ticket', [BusTicketController::class, 'blockTicketApi'])->name('busTicket.blockTicketApi');
        //get boarding point details ...
        Route::get('/getBoardingPointDetails', [BusTicketController::class, 'getboardingpointdetails'])->name('busTicket.getAvailableTrip');
        Route::post('/fetchboardingpointdetails', [BusTicketController::class, 'fetchandstoreboardingpointdetails'])->name('busTicket.fetchandstoreboardingpointdetails');
        //booked tickets
        Route::get('/checkBookedTickets', [BusTicketController::class, 'getcheckBookedTickets'])->name('busTicket.checkBookedTickets');
        Route::post('/fetchBookedTickets', [BusTicketController::class, 'fetchBookedTickets'])->name('busTicket.fetchBookedTickets');
        // Ticket cancelation 
        Route::get('/ticketCancellation', [BusTicketController::class, 'ticketCancellation'])->name('busTicket.ticketCancellation');
    });
    Route::get('/admin/busTicket/fetchSourceCities', [BusTicketController::class, 'fetchSourceCities'])->name('admin.busTicket.fetchSourceCities');
    Route::post('/admin/busTicket/fetchSourceCities', [BusTicketController::class, 'fetchSourceCities'])->name('admin.busTicket.fetchSourceCities');
    Route::post('/admin/busTicket/fetchDestinationCities', [BusTicketController::class, 'fetchDestinationCities'])->name('admin.busTicket.fetchDestinationCities');

    Route::get('/admin/bus-ticket/block', [BusTicketController::class, 'blockTicket'])->name('admin.bus-ticket.block');
    Route::post('/admin/bus-ticket/block/api', [BusTicketController::class, 'blockTicketApi'])->name('admin.bus-ticket.block.api');
    Route::match(['get', 'post'], '/admin/bus-ticket/block/api', [BusTicketController::class, 'blockTicketApi'])
        ->name('admin.bus-ticket.block.api');

    //DMT Bank 2 Remitter
    Route::prefix('/admin')->middleware(['auth'])->group(function () {
        Route::get('/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query');
        Route::post('/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query.post');
        Route::get('/remitter2/queryRemitter', [Remitter2Controller::class, 'showQueryForm'])->name('remitter.query');
        Route::post('/remitter2/storeRemitter', [Remitter2Controller::class, 'storeRemitterData'])->name('remitter.store');
        //Remitter Adhaar verify 
        Route::get('/remitter2/remitterAdhaarVerifyApi', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi'])->name('remitter.showRemitterAdhaarVerifyApi');
        Route::get('/remitter-adhaar-verify', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi']);
        Route::post('/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar']);

        Route::get('/remitter2/registerRemitter', [Remitter2Controller::class, 'showVerificationForm'])->name('admin.remitter2.register');
        Route::post('/remitter-adhaar-verify', [Remitter2Controller::class, 'registerAdhaarRemitter'])->name('admin.remitter2.verify');
        Route::post('/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar'])->name('remitter.adhaar.verify');
        Route::get('/remitter-adhaar-verify', [Remitter2Controller::class, 'showVerificationForm'])->name('remitter.adhaar.form');
        //Register Remitter
        Route::get('/remitter2/registerRemitter', [Remitter2Controller::class, 'registerRemitter'])->name('admin.remitter2.register');
        Route::get('/admin/remitter2/registrations', [Remitter2Controller::class, 'getRegistrations'])->name('admin.remitter2.registrations');
        Route::prefix('/remitter2')->middleware(['auth'])->group(function () {
            Route::get('/query-remitter', [Remitter2Controller::class, 'showQueryForm'])->name('remitter.query.form');
            Route::post('/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query');
            Route::post('/storeRemitter', [Remitter2Controller::class, 'storeRemitterData'])->name('remitter.store');
            Route::get('/remitter-adhaar-verify', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi'])->name('remitter.aadhaar.verify.form');
            Route::post('/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar'])->name('remitter.aadhaar.verify');
            Route::get('/register-remitter', [Remitter2Controller::class, 'registerRemitter'])->name('remitter.register.form');
            Route::post('/register-remitter', [Remitter2Controller::class, 'registerRemitter'])->name('remitter.register');
        });
    });
    Route::post('/api/admin/remitter2/register-remitter', [Remitter2Controller::class, 'registerRemitter'])->name('api.admin.remitter2.register');
    //Beneficiary 
    Route::prefix('/admin/beneficiary2')->middleware('ip.whitelist')->group(function () {

        Route::get('/registerBeneficiary', [Beneficiary2Controller::class, 'registerBeneficiary'])->name('beneficiary2.registerBeneficiary');
        Route::get('/deleteBeneficiary', [Beneficiary2Controller::class, 'deleteBeneficiary'])->name('beneficiary2.deleteBeneficiary');
        Route::post('/deleteBeneficiary', [Beneficiary2Controller::class, 'destroyBeneficiary'])->name('beneficiary2.destroyBeneficiary');
        Route::get('/deletion-history', [Beneficiary2Controller::class, 'getDeletionHistory'])->name('beneficiary2.getDeletionHistory');
        Route::get('/fetchBeneficiary', [Beneficiary2Controller::class, 'fetchBeneficiary'])->name('beneficiary2.fetchBeneficiary');
        Route::get('/fetch', [Beneficiary2Controller::class, 'fetchBeneficiary'])->name('beneficiary2.fetch');

        Route::get('/fetchbyBenied', [Beneficiary2Controller::class, 'fetchbyBenied'])->name('beneficiary2.fetchbyBenied');
        Route::post('/fetch-beneficiary-data', [Beneficiary2Controller::class, 'fetchBeneficiaryData'])->name('beneficiary2.fetchBeneficiaryData');
    });

    Route::match(['get', 'post'], '/beneficiary/register', [Beneficiary2Controller::class, 'registerBeneficiary'])->name('beneficiary.register');
    Route::post('/beneficiary/register', [Beneficiary2Controller::class, 'registerBeneficiary']);

    //Transaction 
    Route::prefix('/admin/transaction2')->middleware('ip.whitelist')->group(function () {
        Route::get('/pennyDrop', [Transaction2Controller::class, 'pennyDrop'])->name('transaction2.pennyDrop');
        Route::get('/transactionSentOtp', [Transaction2Controller::class, 'transactionSentOtp'])->name('transaction2.transactionSentOtp');
        Route::get('/transaction', [Transaction2Controller::class, 'transaction'])->name('transaction2.transaction');
        Route::post('/transact', [Transaction2Controller::class, 'transact'])->name('transaction2.transact');
        Route::get('/transactionStatus', [Transaction2Controller::class, 'transactionStatus'])->name('transaction2.transactionStatus');
        Route::post('/transactionStatus', [Transaction2Controller::class, 'transactionStatus']);
    });
    Route::match(['get', 'post'], '/admin/transaction2/pennyDrop', [Transaction2Controller::class, 'pennyDrop'])->name('transaction2.pennyDrop');
    Route::match(['get', 'post'], '/transaction-sent-otp', [Transaction2Controller::class, 'transactionSentOtp'])->name('transaction.sent.otp');
    //Refund
    Route::prefix('/admin/refund2')->group(function () {

        Route::get('/refundOtp', [Refund2Controller::class, 'refundOtp'])->name('transaction2.refundOtp');
        Route::match(['get', 'post'], '/refundOtp', [Refund2Controller::class, 'refundOtp'])->name('refund2.refundOtp');
        Route::get('/claimRefund', [Refund2Controller::class, 'claimRefund'])->name('transaction2.claimRefund');
        Route::post('/processRefund', [Refund2Controller::class, 'processRefund'])->name('transaction2.processRefund');
    });
    //Utility Bill Payment
    Route::get('/admin/utility-bill-payment/operator-list', [UtilitybillPaymentController::class, 'operatorList'])->name('utilitybillPayment.operatorList');
    Route::get('/operator-list', [UtilitybillPaymentController::class, 'operatorList'])->name('operator.list');
    Route::post('/admin/operator-list', [UtilitybillPaymentController::class, 'operatorList'])->middleware('auth');

    Route::get('/api/operators', [UtilitybillPaymentController::class, 'fetchOperators']);
    Route::post('/admin/get-operators', [UtilitybillPaymentController::class, 'fetchOperators'])->name('admin.get-operators');

    //Fetch Bill Details
    Route::prefix('/admin/utility-bill-payment')->group(function () {

        Route::get('/fetch-bill-details', [UtilitybillPaymentController::class, 'fetchBillDetails'])->name('utilitybillPayment.fetchBillDetails');
        Route::match(['get', 'post'], '/fetch-bill-details', [UtilitybillPaymentController::class, 'fetchBillDetails'])->name('utilitybillPayment.fetchBillDetails');
        //Pay Bill
        Route::get('/pay-bill', [UtilitybillPaymentController::class, 'payBill'])->name('UtilityBillPayment.payBill');
        Route::post('/process-bill-payment', [UtilitybillPaymentController::class, 'processBillPayment'])->name('UtilityBillPayment.processBillPayment');
        //Status Enquiry 
        Route::get('/utility-status-enquiry', [UtilitybillPaymentController::class, 'utilityStatusEnquiry'])->name('utilityStatusEnquiry');
        Route::post('/fetch-utility-status', [UtilitybillPaymentController::class, 'fetchUtilityStatus'])->name('fetchUtilityStatus');
    });
    //Insurance Premium Payment
    Route::prefix('/admin/InsurancePremiumPayment')->group(function () {
        Route::get('/FetchInsuranceBillDetails', [InsurancePremiumPaymentController::class, 'fetchInsuranceBillDetails'])->name('InsurancePremiumPayment.FetchInsuranceBillDetails');
        Route::get('/PayInsuranceBill', [InsurancePremiumPaymentController::class, 'payInsuranceBill'])->name('InsurancePremiumPayment.PayInsuranceBill');

        Route::get('/FetchInsuranceBillDetails', [InsurancePremiumPaymentController::class, 'fetchInsuranceBillDetails'])->name('InsurancePremiumPayment.FetchInsuranceBillDetails');
        Route::post('/fetch-lic-bill', [InsurancePremiumPaymentController::class, 'fetchLICBill'])->name('InsurancePremiumPayment.fetchLICBill');

        Route::get('/InsuranceStatusEnquiry', [InsurancePremiumPaymentController::class, 'insuranceStatusEnquiry'])->name('InsurancePremiumPayment.InsuranceStatusEnquiry');
        Route::post('/fetchInsuranceStatus', [InsurancePremiumPaymentController::class, 'fetchInsuranceStatus'])->name('InsurancePremiumPayment.fetchInsuranceStatus');
    });
    Route::get('/pay-insurance-bill', [InsurancePremiumPaymentController::class, 'payInsuranceBill']);
    Route::match(['get', 'post'], '/pay-insurance-bill', [InsurancePremiumPaymentController::class, 'payInsuranceBill']);
    //Fastag Recharge
    //operator
    Route::prefix('/admin')->group(function () {
        Route::get('/FastagRecharge/FastagOperatorList', [FastagRechargeController::class, 'fastagRechargeOperatorList'])->name('FastagRecharge.FastagOperatorList');
        Route::get('/fastag-operators', [FastagRechargeController::class, 'fastagRechargeOperatorList'])->name('admin.fastag-operators');
        //consumer details 
        Route::get('/FastagRecharge/fetchConsumerDetails', [FastagRechargeController::class, 'fetchConsumerDetails'])->name('FastagRecharge.FastagFetchConsumerDetails');
        //recharge
        Route::get('/FastagRecharge/fastagRecharge', [FastagRechargeController::class, 'FastagRecharge'])->name('FastagRecharge.FastagRecharge');
        //status
        Route::get('/FastagRecharge/FastagStatus', [FastagRechargeController::class, 'FastagStatus'])->name('FastagRecharge.FastagStatus');
    });
    Route::post('/api/fetchConsumerDetails', [FastagRechargeController::class, 'getConsumerDetails'])->name('FastagRecharge.getConsumerDetails');
    //LPG
    Route::prefix('admin/LPG')->group(function () {
        Route::get('/LPGOperator', [LPGController::class, 'LPGOperator'])->name('LPG.LPGOperator');
        //fetch lpg details
        Route::get('/LPGDetails', [LPGController::class, 'FetchLPGDetails'])->name('LPG.FetchLPGDetails');
        Route::match(['get', 'post'], '/admin/LPG/FetchLPGDetails', [LPGController::class, 'FetchLPGDetails'])->name('LPG.FetchLPGDetails');
        Route::get('/LPGBill', [LPGController::class, 'LPGBill'])->name('LPG.LPGBill');
        Route::get('/LPGStatus', [LPGController::class, 'LPGStatus'])->name('LPG.LPGStatus');
    });

    //lpg
    Route::post('/pay-lpg-bill', [LPGController::class, 'payLpgBill']);
    Route::get('/lpg-bill-history', [LPGController::class, 'getLpgBillHistory']);
    Route::post('api/fetch-lpg-operator', [LPGController::class, 'fetchLPGOperator']);
    //status

    Route::post('/lpg-status', [LPGController::class, 'getLPGStatus']);
    //Municipality
    //operator
    Route::get('/admin/Municipality/MunicipalityOperator', [MunicipalityController::class, 'MunicipalityOperator'])->name('Municipality.MunicipalityOperator');
    Route::get('/municipality/operator', [MunicipalityController::class, 'showMunicipalityOperator'])->name('municipality.operator'); // only to fetch operators data from databse
    Route::post('/municipality/fetch', [MunicipalityController::class, 'fetchMunicipalityOperator'])->name('municipality.fetch'); //used to fetch from api
    Route::post('/municipality/save', [MunicipalityController::class, 'store']); // use to stor fetched opertor from api to databse

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

    Route::get('/get-csrf-token', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });

    //cms airtel 
    Route::prefix('/admin')->group(function () {
        Route::get('/cmsairtel/GenerateUrl', [CMSAirtelController::class, 'generateUrl']);
        Route::get('/cmsairtel/AirtelTransactionEnquiry', [CMSAirtelController::class, 'AirtelTransactionEnquiry']);
        Route::get('/airtel-transaction-enquiry', [CMSAirtelController::class, 'airtelTransactionEnquiry'])->name('admin.airtel.transaction.enquiry');
        Route::post('/get-bill-operators', [CMSAirtelController::class, 'getBillOperators'])->name('admin.get.bill.operators');
    });
    Route::get('/add-account', [AccountController::class, 'create'])->name('account.create');
    Route::post('/add-account', [AccountController::class, 'store'])->name('account.store');

    Route::middleware(['web', 'auth'])->group(function () {
        Route::get('/cms/airtel/generate', [CMSAirtelController::class, 'generateUrl'])->name('cms.airtel.generate');
        Route::get('/cms/airtel/enquiry', [CMSAirtelController::class, 'airtelTransactionEnquiry'])->name('cms.airtel.enquiry');
    });
    Route::post('/admin/cmsairtel/generateUrl', [CMSAirtelController::class, 'processGenerateUrl'])->name('admin.cmsairtel.process');
    //fund request
    Route::get('/admin/fundrequest/fundrequest', [FundController::class, 'fundrequest'])->name('fundrequest');
    Route::get('/fundrequest', [FundController::class, 'fundrequest']);
    Route::post('/fundrequest/store', [FundController::class, 'store']);

    Route::get('/admin/wallet-balance', [AdminController::class, 'getWalletBalance'])->name('admin.wallet-balance')->middleware('auth', 'ip.whitelist');
    Route::get('/admin/cmsairtel/generate-url', [CMSAirtelController::class, 'generateUrl'])->name('generateAirtelUrl');
    Route::match(['get', 'post'], '/generate-airtel-url', [CMSAirtelController::class, 'generateUrl'])->name('generate.airtel.url');
    Route::post('/airtel-transaction-enquiry', [CMSAirtelController::class, 'airtelTransactionEnquiry']);

    Route::get('/admin/ipwhitelist/ipwhitelist', [IPWhitelist::class, 'IPWhitelist']);

    Route::get('/admin/hlr/hlrcheck', [HLRController::class, 'hlrcheck']);
    Route::get('/hlrcheck', [HLRController::class, 'hlrcheck']);
    Route::post('/hlrcheck', [HLRController::class, 'hlrcheck']);
    Route::match(['get', 'post'], '/admin/hlr/hlrbrowseplan', [HLRController::class, 'hlrbrowseplan'])->name('hlrbrowseplan');
