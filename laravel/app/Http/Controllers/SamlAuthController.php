<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use OneLogin\Saml2\Utils;
use Slides\Saml2\Events\SignedIn;
use Slides\Saml2\Models\Tenant;

class SamlAuthController extends Controller
{
    public function redirectToLoginProvider(): void
    {
        // the used package supports multiple SAML tenants with tenant UUID in the URLs, however the metadata used for this demo has been registered without tenant ID
        // => so in this demo, we only support one SAML tenant
        // if you want to support multiple tenants, you have to register metadata for each of your tenants, the artisan saml2:create-tenant command will give you the URLs with SAML tenant UUIDs included
        $tenant = Tenant::first();

        if (! $tenant) {
            abort(404);
        }

        $auth = new \Slides\Saml2\Auth(app('OneLogin_Saml2_Auth'), $tenant);

        $redirectUrl = $auth->getTenant()->relay_state_url ?: config('saml2.loginRoute');

        $auth->login($redirectUrl);
    }


    public function logoutAtLoginProvider(): void
    {
        // the used package supports multiple SAML tenants with tenant UUID in the URLs, however the metadata used for this demo has been registered without tenant ID
        // => so in this demo, we only support one SAML tenant
        // if you want to support multiple tenants, you have to register metadata for each of your tenants, the artisan saml2:create-tenant command will give you the URLs with SAML tenant UUIDs included
        $tenant = Tenant::first();

        if (! $tenant) {
            abort(404);
        }

        $auth = new \Slides\Saml2\Auth(app('OneLogin_Saml2_Auth'), $tenant);

        $auth->logout(
            nameId: session()->get('samlNameId'),
            sessionIndex: session()->get('samlSessionIndex'),
            nameIdNameQualifier: 'https://prihlasenie.upvsfix.gov.sk/oam/fed',
        );
    }

    public function loginCallback(): Application|RedirectResponse|Redirector
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

        $user = $auth->getSaml2User();

        event(new SignedIn($user, $auth));

        $redirectUrl = $user->getIntendedUrl();

        if ($redirectUrl) {
            return redirect($redirectUrl);
        }

        return redirect($auth->getTenant()->relay_state_url ?: config('saml2.loginRoute'));
    }

    private function logoutCallback():  Application|RedirectResponse|Redirector
    {
        $tenant = Tenant::first();

        if (! $tenant) {
            abort(404);
        }

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

    public function logoutRequestFromSp(): Application|RedirectResponse|Redirector
    {
        // otherwise the Utils would take only http://127.0.0.1
        // also solves this issue: https://github.com/SAML-Toolkits/php-saml/issues/464
        // check the README for description of the problem
        Utils::setBaseURL($baseUrl ?? 'https://127.0.0.1:3001/auth/saml/');

        return $this->logoutCallback();
    }

    public function logoutRequestFromIdp(): Application|RedirectResponse|Redirector
    {
        // otherwise the Utils would take only http://127.0.0.1
        // also solves this issue: https://github.com/SAML-Toolkits/php-saml/issues/464
        // check the README for description of the problem
        Utils::setBaseURL($baseUrl ?? 'https://127.0.0.1:3001/upvs/');

        return $this->logoutCallback();
    }
}
