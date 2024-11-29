<?php

use App\Http\Controllers\SamlAuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::middleware(array_merge(['saml2.resolveTenant'], config('saml2.routesMiddleware')))
    ->group(function () {
    Route::get('/login', [SamlAuthController::class, 'redirectToLoginProvider'])->name('login');
    Route::get('/logout', [SamlAuthController::class, 'logoutAtLoginProvider'])->name('logout');
    Route::post('/auth/saml/callback', [SamlAuthController::class, 'loginCallback'])->name('login-callback');
    Route::get('/auth/saml/logout', [SamlAuthController::class, 'logoutRequestFromSp'])->name('logout-callback');;
    Route::get('/upvs/logout', [SamlAuthController::class, 'logoutRequestFromIdp'])->name('logout-request');;
});

Route::get('/authenticated', function () {
    if(!Auth::check()) {
        return redirect()->to(url('/'));
    }

    return view('authenticated', ['user' => Auth::user()]);
})->name('authenticated');

Route::get('/error', function () {
    return view('error', ['errors' => request('errors')]);
})->name('error');
