<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Log;
use OneLogin\Saml2\Utils;
use Slides\Saml2\Auth;
use Slides\Saml2\Events\SignedIn;
use Slides\Saml2\Events\SignedOut;
use Slides\Saml2\Models\Tenant;

class SamlAuthController extends Controller
{
    public function __construct()
    {
    }

    public function redirectToLoginProvider(): void
    {
        $tenant = Tenant::first();

        if (! $tenant) {
            abort(404);
        }

        $auth = new \Slides\Saml2\Auth(app('OneLogin_Saml2_Auth'), $tenant);

        $redirectUrl = $auth->getTenant()->relay_state_url ?: config('saml2.loginRoute');

        $auth->login($redirectUrl);
    }


    public function logoutAtLoginProvider(): RedirectResponse
    {
        $uuid = Tenant::first()?->uuid;

        if (! $uuid) {
            abort(404);
        }

        Log::info('logout samlNameId: ' . session()->get('samlNameId'));
        Log::info('logout samlSessionIndex: ' . session()->get('samlSessionIndex'));

        return redirect()->to(config('app.url') . "/saml2/{$uuid}/logout"
            . '?nameId=' . session()->get('samlNameId')
            . '&sessionIndex=' . session()->get('samlSessionIndex')
        );
    }

    public function loginCallback()
    {
        $tenant = Tenant::first();

        if (! $tenant) {
            abort(404);
        }

        // otherwise the Utils would take only http://127.0.0.1
        // also solves this issue: https://github.com/SAML-Toolkits/php-saml/issues/464
        Utils::setBaseURL('https://127.0.0.1:3001/auth/saml/');

        $auth = new \Slides\Saml2\Auth(app('OneLogin_Saml2_Auth'), $tenant);

        $errors = $auth->acs();

        if (!empty($errors)) {
            $error = $auth->getLastErrorReason();
            $uuid = $auth->getTenant()->uuid;

            logger()->error('saml2.error_detail', compact('uuid', 'error'));
            session()->flash('saml2.error_detail', [$error]);

            logger()->error('saml2.error', $errors);
            session()->flash('saml2.error', $errors);

            return view('error', ['errors' => $errors]);
        }

        session()->put('samlNameId', $auth->getSaml2User()->getNameId());
        session()->put('samlSessionIndex', $auth->getSaml2User()->getSessionIndex());
        Log::info('login samlNameId: ' . $auth->getSaml2User()->getNameId());
        Log::info('login samlSessionIndex: ' . $auth->getSaml2User()->getSessionIndex());

        $user = $auth->getSaml2User();

        event(new SignedIn($user, $auth));

        $redirectUrl = $user->getIntendedUrl();

        if ($redirectUrl) {
            return redirect($redirectUrl);
        }

        return redirect($auth->getTenant()->relay_state_url ?: config('saml2.loginRoute'));
    }

    public function logoutCallback()
    {
        $tenant = Tenant::first();

        if (! $tenant) {
            abort(404);
        }

        // otherwise the Utils would take only http://127.0.0.1
        // also solves this issue: https://github.com/SAML-Toolkits/php-saml/issues/464
        Utils::setBaseURL('https://127.0.0.1:3001/auth/saml/');

        $auth = new \Slides\Saml2\Auth(app('OneLogin_Saml2_Auth'), $tenant);

        $errors = $auth->sls(config('saml2.retrieveParametersFromServer'));

        if (!empty($errors)) {
            $error = $auth->getLastErrorReason();
            $uuid = $auth->getTenant()->uuid;

            logger()->error('saml2.error_detail', compact('uuid', 'error'));
            session()->flash('saml2.error_detail', [$error]);

            logger()->error('saml2.error', $errors);
            session()->flash('saml2.error', $errors);

            return view('error', ['errors' => $errors]);
        }

        session()->flush();

        return redirect(config('saml2.logoutRoute')); //may be set a configurable default
    }

    public function logoutRequestFromIdp()
    {
        return $this->logoutCallback();
    }
}
