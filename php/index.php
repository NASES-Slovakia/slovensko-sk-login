<?php

// Include the Composer autoload file
require_once __DIR__ . '/vendor/autoload.php';

// Use the necessary SAML classes
use OneLogin\Saml2\Auth;
use OneLogin\Saml2\Constants;
use OneLogin\Saml2\LogoutResponse;
use OneLogin\Saml2\Settings;
use OneLogin\Saml2\Utils;

session_start();

// Define the IdP and SP configurations
$idp_config = [
    'entityId' => 'https://prihlasenie.upvsfix.gov.sk/oam/fed',
    'singleSignOnService' => [
        'url' => 'https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20',
    ],
    'singleLogoutService' => [
        'url' => 'https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20',
    ],
    'x509cert' => 'MIIDXjCCAkagAwIBAgIKFsJi7wAAAAAEdjANBgkqhkiG9w0BAQsFADAaMRgwFgYDVQQDEw9jYS5zbG92ZW5za28uc2swHhcNMjMwMTI0MTI0ODMwWhcNMjYwMTI0MTI1ODMwWjAqMQswCQYDVQQGEwJTSzEbMBkGA1UEAxMSaWRwLnVwdnNmaXguZ292LnNrMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp4z3fUar52k1U1y5OFFpPWFYolv76Yk2leBrgiwwg6SholhWTR3hztNMYEqnZKUOMNVg6GAbnEGvevsdsf/xZKZo3npaphkKF1OMzmrEuT8YB5J0+c7FGILPgNd5Pcg0VN2wbwyTJ9vukYAIxp7Nugx5DRAS9kj6jLNT/WFi6Pa9VdAp4fW09Rg8wtfp+ThDjAJs3PPXcZhVY7etLJF7yztsn6eJeO1MEwCcjdJ3KAPqEDGAbtI3xuR7R3hiPX0FN/ILTk9DoUHV5Aj7DTNquUKbh2sxro3K+RemRJ0Zsfxs+OMbAPfWWGOUxONbCsNpj2GYPTI3gMCo+hiUXp8tnQIDAQABo4GVMIGSMA4GA1UdDwEB/wQEAwIE8DATBgNVHSUEDDAKBggrBgEFBQcDAjAdBgNVHQ4EFgQUpB8qqDoECbwcbnAtlEQAP3ipG98wHwYDVR0jBBgwFoAUKlO3Thprk0Xf6VQr2tu4TpoSzoYwDAYDVR0TAQH/BAIwADAdBgNVHREEFjAUghJpZHAudXB2c2ZpeC5nb3Yuc2swDQYJKoZIhvcNAQELBQADggEBAKOL2PbGO8M3+kFKCQM8vfLNIdFCQw6OBnRftLxs8Xrd310BhhoKWYY6wk4U6xRF3GN/6OGY378rPyxedeJS2nHjIopRIwcHg8x4F09XRUFT24KrCXm/T17hiWcnGt7VIrof6VJHwoyes7D4++qzoFl1jHptjx7RCaF5pwLyFzs/dgIozj+KaRra2dllYPkdFKKNZk0EJteK5bT4rsr+KYUILxBd8FjAl3K0QjT7W/vII2A2szm+d9STyvq1/MthuqKy4kkesekUN8lWBhnRtax37nFmRqFGXNj6ZWoTW+XK00ajwE+7EP7vjepKwby/xWtV8aeqjj2K07hNtSA5OFA=',
];

$sp_config = [
    'entityId' => 'https://localhost.dev2',
    'assertionConsumerService' => [
        'url' => 'https://localhost.dev:3001/auth/saml/callback',
    ],
    'singleLogoutService' => [
        'url' => 'https://localhost.dev:3001/auth/saml/logout',
    ],
    'x509cert' => 'MIIC0jCCAbqgAwIBAgIJAIr0WzkIL6fiMA0GCSqGSIb3DQEBDQUAMBcxFTATBgNVBAMTDGljby04MzEzMDA2NjAeFw0yNDExMTIwODI1MTJaFw0yNjExMTIwODI1MTJaMBcxFTATBgNVBAMTDGljby04MzEzMDA2NjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKuc5o1O7CjDF0LME7tbuVkfjYeuVvAD5ZE0r/vROVkV1hkwQqwTb7/QCNRtt8x/jb04kf+tNk33cfDZ6Pz/MnsV3iuL/ZA4YF2ecisYPnpBY6UXzeBuWhsT+i0JBqrD5MQAkM/2eoztb5VM0DKLMPqs7iEmkSWsz2t7bg9j83Lt5kkaffJ/qSi2gMb0CJbW2t14QDKJQ7D0nxL3DTIttgg0IoFsX72/EZFLhoSNwbkX1wfGu+ruNi2GCvly9PCiYSMgMogs/lSGZVGlBZe2MJc2CR/5fvOL29ChVL8KU6LYeR8yenMELoK9SoyJK7qp0bGyqDxMA3ytkBWLIEuRNG0CAwEAAaMhMB8wHQYDVR0OBBYEFN4DCv8pla+6Qxji32jieReyWHeUMA0GCSqGSIb3DQEBDQUAA4IBAQBaxqfBP1pBaYQ5SkpGcNmMuRXtg457xhBn3f3rtQymz0IX/AUlaXQPUEdzT31p3gyE8MpuYB2l524dPbUnqjsfG5EPNKOpXWhVZPH6SzA0g66+L9nLbczZ3qBZ87HbofBTgmtu+U/e1kIoy/KK8FyJvc72Knb1CbI9DjSi4fpeK2WakI+i7INiF7sFXXpQ/M4JNhYRCZBQoVARP6oS3+Fv7tob0jGP7x8MrD4Q4cy5xTLCPWel+dYKLffzeRgAiYHerQmO3nPiVByX838NQd4Wx9Zsp+WUAjXz//m1AGJHxlqEZuloPNPLhMLzAl5pNGe+Vo4K07RygyFsaiYfnE0j',
    'privateKey' => 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrnOaNTuwowxdCzBO7W7lZH42HrlbwA+WRNK/70TlZFdYZMEKsE2+/0AjUbbfMf429OJH/rTZN93Hw2ej8/zJ7Fd4ri/2QOGBdnnIrGD56QWOlF83gblobE/otCQaqw+TEAJDP9nqM7W+VTNAyizD6rO4hJpElrM9re24PY/Ny7eZJGn3yf6kotoDG9AiW1trdeEAyiUOw9J8S9w0yLbYINCKBbF+9vxGRS4aEjcG5F9cHxrvq7jYthgr5cvTwomEjIDKILP5UhmVRpQWXtjCXNgkf+X7zi9vQoVS/ClOi2HkfMnpzBC6CvUqMiSu6qdGxsqg8TAN8rZAViyBLkTRtAgMBAAECggEAALyJY8FbM5iUvLll+0ebPcXsJFEr99c4cL1WZQECmz6D/vMtUhI6SEszAoBfCc5hVBbOT5fVdBO0BjnVLWLF+2++VpcA9VG8niI8MLGnsPwfWpnFzSkEE3osOG3BvNFe5bVv6aiP4ZNyR2R/PzxIL0c3NWa2OEBr2nT65a+C37MiXGbiZ6Zv+mfMKb23IOrd0AGk3aQ38rJeBQVVVAsc+2qIV+TITy/6OlU8BE7HijYucBisIvIn1VbjZqUI1rUXdsKiDPhJZQBU05AdA3XERvHSggI8Z965c9v6S963hKjpqrQh+6WqsjNKhZRQscM2vHEhvvQXn90Jr+RSSToXAQKBgQDhCDSmedRhVQtlBvbelinkpYsunMcuc4V0CWgTbDYDDIi4wflNT9+HHh0tNuKQXrWguN9sjqVAqzuXJ5tYtBS2vaxPz6/chJBp9CTLCwNJt6lcICy2dcsMBalfUl8eF9PfBB0Irs8w8jU3ZFwOHo+aanAuxkhfQwONRsA5IIzRAQKBgQDDOsIQVC0ZF+llcV2J6QOtvnNxWoRVfNzhaUQFCSZTJ81PayOyp93MKJO/b/zL3xMdQHeYhpJuzPRx+CFaeveM8udtqdiBWeGooZhHrll79ROo1FerfsXAeG3rGHYQG85fvuDvzhVGgNeEXrXa3X6RtCbE7onUDV7fJUGGabU3bQKBgQCq1cjqrUifT6nj24Kk/oj1TPu5ukm4KPkiW1XIkPj8HZLZ+GBj4gRHFoR949HiWhQ23MK5Lh2kV5pYqTfVAnlLNflPadMPbRAZb8BS6JxpZWXMS5zGM+yextmLRQRy2xH8l6nXAqbGeMoPsD/2dBr+1lkuGVeuAjj7EsAxXlWpAQKBgFP+X6fuz0hQhVXjpD7FRZPmsHxAWVb+VXmVdHJGMXrtUOOuULl4h3BitM5UPArqeqrHJa01mKKbA0BVZOQsq3y0tOT1gfSE2xVWENImLNGr6z1jviRGcoYQShovd/wOOofu84+4tmaS4CZPKSZ0zROa0mM/zYSyC/MtcDeIGzMxAoGBAIi1kD8l1ikgQQUcmlUNBFd8/1O8vxxHGfMHZd/wqnAxlc+2ux0yvpVJOJsCuyh6h4LGgiHV7XB0QbLv/QFRE+CLnfqNRrUZbg3DN4ybqYG3tWBZ3Pw6xWS2Qm9CB4Q7EhwAsyl3Gg9CL9Rpw3n1dY6WnGzQx/hwbsSZ/jD6+VGs',
];

// Create the SAML Settings
$settings = [
    'strict' => true,
    'baseurl' => 'https://localhost.dev:3001',
    'sp' => $sp_config,
    'idp' => $idp_config,
    'security' => [
        'authnRequestsSigned' => true,
        'logoutRequestSigned' => true,
        'logoutResponseSigned' => true,
        'wantAssertionsSigned' => true,
        'wantAssertionsEncrypted' => true,
        'wantNameId' => true,

        // Metadata and Signature Configurations
        'metadataSigned' => true,
        'signMetadata' => true,
        'embedSign' => true,

        // Hashing and Signing Methods
        'digestAlgorithm' => 'http://www.w3.org/2001/04/xmlenc#sha256',
        'signatureAlgorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
        'requestedAuthnContext' => false,
        'destinationStrictlyMatches' => false,
        'requestedAuthnContextComparison' => 'exact', // not 'maximum', only 'exact' or 'minimum'
    ],
];

// Create the Auth object with the Settings object
$auth = new Auth($settings);

// Get the current request URI
$current_url = $_SERVER['REQUEST_URI'];

// process login response
if (strpos($current_url, 'auth/saml/callback') !== false) {
    try {
        // If SAML Response is present, validate and process the response
        $auth->processResponse();

        // Check if the response is valid
        if ($auth->isAuthenticated()) {
            // SAML authentication is successful
            $_SESSION['samlUserdata'] = $auth->getAttributes();
            $_SESSION['samlNameId'] = $auth->getNameId();
            $_SESSION['samlNameIdFormat'] = $auth->getNameIdFormat();
            $_SESSION['samlNameidNameQualifier'] = $auth->getNameIdNameQualifier();
            $_SESSION['samlNameidSPNameQualifier'] = $auth->getNameIdSPNameQualifier();
            $_SESSION['samlSessionIndex'] = $auth->getSessionIndex();

            $name = $auth->getAttribute('Actor.FirstName')[0] . ' ' . $auth->getAttribute('Actor.LastName')[0];

            echo <<<HTML
                <h1>Authenticated! Welcome, $name!</h1>
                <form method="POST" action="https://localhost.dev:3001/logout">
                    <button type="submit" name="logout">Logout</button>
                </form>
                <p>User data:
                    <pre>
HTML;

            var_export($auth->getAttributes());

            echo <<<HTML
                        </pre>
                    </p>
HTML;
        } else {
            echo "Authentication failed!";
        }
    } catch (Exception $e) {
        echo "Error processing SAML response: " . $e->getMessage();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    $returnTo = 'https://localhost.dev:3001/auth/saml/logout';
    $nameId = null;
    $sessionIndex = null;
    $nameIdFormat = null;
    $nameIdNameQualifier = null;
    $nameIdSPNameQualifier = null;

    if (isset($_SESSION['samlNameId'])) {
        $nameId = $_SESSION['samlNameId'];
    }
    if (isset($_SESSION['samlSessionIndex'])) {
        $sessionIndex = $_SESSION['samlSessionIndex'];
    }
    if (isset($_SESSION['samlNameIdFormat'])) {
        $nameIdFormat = $_SESSION['samlNameIdFormat'];
    }
    if (isset($_SESSION['samlNameIdNameQualifier'])) {
        $nameIdNameQualifier = $_SESSION['samlNameIdNameQualifier'];
    }
    if (isset($_SESSION['samlNameIdSPNameQualifier'])) {
        $nameIdSPNameQualifier = $_SESSION['samlNameIdSPNameQualifier'];
    }

    $auth->logout($returnTo, [], $nameId, $sessionIndex, false, $nameIdFormat, $nameIdNameQualifier, $nameIdSPNameQualifier);

} elseif (strpos($current_url, 'auth/saml/logout') !== false) {
    $logoutResponse = new LogoutResponse(new Settings($settings), $_GET['SAMLResponse']);

    if (!$logoutResponse->isValid()) {
        echo "Logout failed, invalid logout respponse!";
    } else if ($logoutResponse->getStatus() !== Constants::STATUS_REQUESTER) {
        echo "Logout failed!";
    } else {
        echo $logoutResponse->getXML();
        Utils::deleteLocalSession();
        echo "Logout successful!";
    }
} else {
    // Redirect to the IdP for authentication
    $auth->login();
}
?>
