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
    'entityId' => 'https://127.0.0.1.slovensko.sk.login2',
    'assertionConsumerService' => [
        'url' => 'https://127.0.0.1:3001/auth/saml/callback',
    ],
    'singleLogoutService' => [
        'url' => 'https://127.0.0.1:3001/auth/saml/logout',
    ],
    'x509cert' => "MIIC0jCCAbqgAwIBAgIJAIFbvHv7QDurMA0GCSqGSIb3DQEBDQUAMBcxFTATBgNVBAMTDGljby04MzEzMDA2NjAeFw0yNDExMjcwODM5MDVaFw0yNjExMjcwODM5MDVaMBcxFTATBgNVBAMTDGljby04MzEzMDA2NjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALGTNychJTmMUEk5zp3jo5UU3n4OleoJkDBpMGLWK8Vx7CB1c0+V6OGfv6vXelwHWz5v3le7GYnOVnxs8ji4/rOy5NycasrbNvYyN0ds+bmipzeYfss5Jc16//5u+ubUjOQAt/nJKEqautvXyfLXIc45IDLec7gHDxvyfbqK1r9j06Jok8zL5RQRfe22KYcbrUYbczilDqK+N+owW8FLJgaMHuQBCuKh+60MzIb1FjUxwgvTla1J85yoLulKayzZhLQR1LISoHo0gmn/xO7sOCSe/uSZMuMbXVnto3tIqYd5CLOLN4ueTX/Db+SdNCRXXGoq1P0bIeqzZDMsiM7/8ZkCAwEAAaMhMB8wHQYDVR0OBBYEFP8tiwn5IiXj/aHXWO7/1mLUza6KMA0GCSqGSIb3DQEBDQUAA4IBAQAuWZinH2gdBVQs+Jd8Xxrw+FbOYFhZhJ/Ev2vqSe76NK+pLx5S7gJc8ag8oyLTufdY0RXJ6FHW/ArYJo/n9WPD5xrtP3r95a+1b2R7OOXOVui2DPQ4fJPiZXpz8GnwrwwmWu6WYesxdUvV2eVRy30Taj9JGAaTwiQsDGSG6yPasK0llgGp4fzaAt9DFF1rhk7G+ZfwAUK93wEvmNHTzoPYxpaLe2Dc32AXQeSaWvZungFrjmVgHUlkxsGa7m7Wi3XZz3SY/FaQXaJGvaE0tFi/frP9SdIDoIGH+K+afw+7dtTdCkAi8ornePGbhTSRsJ2yymVs3rarSU3dT7+8609r",
    'privateKey' => "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxkzcnISU5jFBJOc6d46OVFN5+DpXqCZAwaTBi1ivFcewgdXNPlejhn7+r13pcB1s+b95XuxmJzlZ8bPI4uP6zsuTcnGrK2zb2MjdHbPm5oqc3mH7LOSXNev/+bvrm1IzkALf5yShKmrrb18ny1yHOOSAy3nO4Bw8b8n26ita/Y9OiaJPMy+UUEX3ttimHG61GG3M4pQ6ivjfqMFvBSyYGjB7kAQriofutDMyG9RY1McIL05WtSfOcqC7pSmss2YS0EdSyEqB6NIJp/8Tu7Dgknv7kmTLjG11Z7aN7SKmHeQizizeLnk1/w2/knTQkV1xqKtT9GyHqs2QzLIjO//GZAgMBAAECggEAFLXaQ16KxGT4ginTTrfbfsoxztrtoh+eaP8DrStUbJFGXFzGZ5xQzmu+w5B8jVowSp5qfKnuJxPhI17jezkcP6IYLiCyFdmuVdVyfAqaL4voW8QV2abfIVF8pNSVv7E/g2IQEvpikBzuuTA4NfHgV/hyqGwoa+iq2vQTtNt3g1ezqBzINqdwmAbGwfk/SudbTTBcQjYbRo7EQYwLN3wqqEpWKvssp7EtJdtGTcMazKE69aGiCIOiBuE1AN9EBswZQAdQSrWR3nz2m972ZO8PrTDWYnkZWNHvWOuTr+oCKkDFLTlgM+hf+fYXddOG+yzvCCLJkNmNhz+PfmJH67LjgQKBgQDvatdLmSlNt06or+JPOHItgtZF3fufWAYqtRMVWrhv1XjS4dMwL+1WIJoTnyewQe97bjQ/WRZUsukM4U4TaOKqnryg2S1Lt4/S093LZ2tHwklNQWwrj/t3DOJd6Uqv0+RGz27RjX+x+dIxjvJWNF2rYnzJTVb84HWT96aoONoi4QKBgQC939X/bLODb3iSEFx+SBNpifnSHj7yG61j9ZX02G9OKlf1PEs9Sal7dtTRBNOgM91tSZYr591Tb/F54SAZd6FxxEMWzvhNTmnE8YgIxZmrZdnaUgYqpTBFl4z3yMM1y4fICYDpcPZ4epHCTEGoG6+ZYcfg3KAcX0JcO6obIdFduQKBgAEHuqlunUjiUwpSx2yD16nueDGQxPZokI46fTyISWbhykVOB3SboC/QsBkJhEgz4G3tiXgEUB5JLsuJZKacuuz1BebDSHic75d+peOsLEAAzAPzFh4R3okimw7AZDvhc4gCeH2aWERRyN/Bt7U7QHPuVo8fMBKifJ8IX8U1iWrBAoGAYzw1UAWz3KHJ1i0O6kEpRCOEmbiNFWQ5vuB/uzPTGHsw9U7J1AJHvethVsy6/iOdOp0XC2NnXVBIWHa8nBLWIet9VNJfG6g7x16kxlDf+6CDt4LfDjK/g9+tIWOgAuGY2Yd+BIOxjU4iF/Za6k1t/TAJkxA77hgrSqE0SnHmRqECgYAQrtrlANQwWXgyH/5stK5ZHSWRwTLSJWbv74F3e/9pwQiFMPs+krkslMDgQTHvWcoUhpJ+XuZZarsOmC31zm1Q7D6y//Q985FClh7Ia8l/I8aEJCsED5es54dPOgvH7NUnYPLWGk1u98gNqwiqgVCOAYG8A0tn05VQZgcH6xYARw==",
];

// Create the SAML Settings
$settings = [
    'strict' => true,
    'baseurl' => 'https://127.0.0.1:3001',
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
if (str_contains($current_url, 'auth/saml/callback')) {
    try {
        // If SAML Response is present, validate and process the response
        $auth->processResponse();

        // Check if the response is valid
        if ($auth->isAuthenticated()) {
            // SAML authentication is successful
            $_SESSION['samlUserdata'] = $auth->getAttributes();
            $_SESSION['samlNameId'] = $auth->getNameId();
            $_SESSION['samlNameIdFormat'] = $auth->getNameIdFormat();
            $_SESSION['samlNameIdNameQualifier'] = $auth->getNameIdNameQualifier();
            $_SESSION['samlNameIdSPNameQualifier'] = $auth->getNameIdSPNameQualifier();
            $_SESSION['samlSessionIndex'] = $auth->getSessionIndex();

            $name = $auth->getAttribute('Actor.FirstName')[0] . ' ' . $auth->getAttribute('Actor.LastName')[0];

            authenticated($name, $auth);
        } else {
            echo "Authentication failed!";
        }
    } catch (Exception $e) {
        echo "Error processing SAML response: " . $e->getMessage();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    $returnTo = 'https://127.0.0.1:3001/auth/saml/logout';
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

} elseif (str_contains($current_url, 'auth/saml/logout')) {
    $logoutResponse = new LogoutResponse(new Settings($settings), $_GET['SAMLResponse']);

    if (!$logoutResponse->isValid()) {
        echo "Logout failed, invalid logout response!";
    } else if ($logoutResponse->getStatus() !== Constants::STATUS_SUCCESS) {
        echo "Logout failed!";
    } else {
        Utils::deleteLocalSession();
        echo "Logout successful!";
        header("Location: /");
        die();
    }
} else if(str_contains($current_url, 'login')) {
    // Redirect to the IdP for authentication
    $auth->login();
} else if(str_contains($current_url, '/upvs/logout')) {
    $auth->processSLO();
} else {
    if (isset($_SESSION['samlSessionIndex'])) {
        echo <<<HTML
        <form method="POST" action="/logout">
            <button type="submit" name="logout">Logout</button>
        </form>
HTML;
    } else {
        echo <<<HTML
        <form method="GET" action="/login">
            <button type="submit" name="login">Login</button>
        </form>
HTML;
    }
}

function authenticated($name, $auth): void
{
    echo <<<HTML
        <h1>Authenticated! Welcome, $name!</h1>
        <form method="POST" action="/logout">
            <button type="submit" name="logout">Logout</button>
        </form>
            <table style="border: 1px solid black; width: 100%;  border-collapse: collapse;">
HTML;

    foreach($auth->getAttributes() as $name => $value) {
        echo <<<HTML
            <tr>
                <td style="font-weight: bold; border: 1px solid black">$name</td>
                <td style="border: 1px solid black">$value[0]</td>
            </tr>
HTML;
    };

    echo <<<HTML
        </table>
    
HTML;
}
?>
