# PHP Laravel slovensko.sk login

## Požiadavky
- Docker alebo [PHP >= 8.2 + Composer + npm + vlastný SSL certifikát]

## Použité knižnice
- [24slides/laravel-saml2](https://github.com/24Slides/laravel-saml2)
- [ryoluo/sail-ssl](https://github.com/ryoluo/sail-ssl)

# Spustenie
1. Nainštalovať Composer dependencies cez Docker
```
   docker run --rm \
   -u "$(id -u):$(id -g)" \
   -v "$(pwd):/var/www/html" \
   -w /var/www/html \
   laravelsail/php83-composer:latest \
   composer install --ignore-platform-reqs
```
2. Vyplniť premenné prostredia v `.env`
```
    cp .env.example .env
```
3. Spustiť Docker container cez Laravel Sail
```
    sail up -d
```
4. Spustiť migrácie a NPM
```
    sail artisan migrate
    sail npm install
    sail npm run dev
```
5. Vytvoriť SAML Tenant s IdP metadátami
```
    sail artisan saml2:create-tenant \
     --entityId="https://prihlasenie.upvsfix.gov.sk/oam/fed" \
     --loginUrl="https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20" \
     --logoutUrl="https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20" \
     --nameIdFormat="transient" \
     --x509cert="MIIDXjCCAkagAwIBAgIKFsJi7wAAAAAEdjANBgkqhkiG9w0BAQsFADAaMRgwFgYDVQQDEw9jYS5zbG92ZW5za28uc2swHhcNMjMwMTI0MTI0ODMwWhcNMjYwMTI0MTI1ODMwWjAqMQswCQYDVQQGEwJTSzEbMBkGA1UEAxMSaWRwLnVwdnNmaXguZ292LnNrMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp4z3fUar52k1U1y5OFFpPWFYolv76Yk2leBrgiwwg6SholhWTR3hztNMYEqnZKUOMNVg6GAbnEGvevsdsf/xZKZo3npaphkKF1OMzmrEuT8YB5J0+c7FGILPgNd5Pcg0VN2wbwyTJ9vukYAIxp7Nugx5DRAS9kj6jLNT/WFi6Pa9VdAp4fW09Rg8wtfp+ThDjAJs3PPXcZhVY7etLJF7yztsn6eJeO1MEwCcjdJ3KAPqEDGAbtI3xuR7R3hiPX0FN/ILTk9DoUHV5Aj7DTNquUKbh2sxro3K+RemRJ0Zsfxs+OMbAPfWWGOUxONbCsNpj2GYPTI3gMCo+hiUXp8tnQIDAQABo4GVMIGSMA4GA1UdDwEB/wQEAwIE8DATBgNVHSUEDDAKBggrBgEFBQcDAjAdBgNVHQ4EFgQUpB8qqDoECbwcbnAtlEQAP3ipG98wHwYDVR0jBBgwFoAUKlO3Thprk0Xf6VQr2tu4TpoSzoYwDAYDVR0TAQH/BAIwADAdBgNVHREEFjAUghJpZHAudXB2c2ZpeC5nb3Yuc2swDQYJKoZIhvcNAQELBQADggEBAKOL2PbGO8M3+kFKCQM8vfLNIdFCQw6OBnRftLxs8Xrd310BhhoKWYY6wk4U6xRF3GN/6OGY378rPyxedeJS2nHjIopRIwcHg8x4F09XRUFT24KrCXm/T17hiWcnGt7VIrof6VJHwoyes7D4++qzoFl1jHptjx7RCaF5pwLyFzs/dgIozj+KaRra2dllYPkdFKKNZk0EJteK5bT4rsr+KYUILxBd8FjAl3K0QjT7W/vII2A2szm+d9STyvq1/MthuqKy4kkesekUN8lWBhnRtax37nFmRqFGXNj6ZWoTW+XK00ajwE+7EP7vjepKwby/xWtV8aeqjj2K07hNtSA5OFA="
```
Tento príkaz vytvorí záznam v DB tabuľke `saml2_tenants`.

6. Aplikácia beží na https://127.0.0.1:3001 so self-signed SSL certifikátom.

> [!CAUTION]
> Z dôvodu zatiaľ neopravenej chyby v knižnici `onelogin/php-saml` (v čase písania - 19.11.2024, https://github.com/SAML-Toolkits/php-saml/issues/464) nie je bez manuálneho zásahu možné používať callback URLky s viacerými časťami, napr. `/auth/saml/callback`.
> V Laraveli sa to dá obísť nastavením `Utils::setBaseURL('https://127.0.0.1:3001/auth/saml/');` - treba zadať celú callback URL, ktorú chcete využívať, bez poslednej časti.
> Pre `https://127.0.0.1:3001/auth/saml/callback` by to bolo `https://127.0.0.1:3001/auth/saml/`. Príklad si môžete pozrieť aj v `app/Http/Controllers/SamlAuthController.php`.


## Metadáta
Metadáta v XML sa nachádzajú v priečinku `../security`.

V tomto projekte sú použité metadáta `localhost_dev_one_key/localhost_dev_fix.metadata.xml` pre SP,
ktoré sú nakonfigurované s rovnakým kľúčom pre encryption aj signing. Knižnica `onelogin/php-saml`, ktorú využíva knižnica `24slides/laravel-saml2` nepodporuje použitie
rôznych kľúčov pre encryption a signing.

Pre IdP sú použité metadáta `upvs_fix.metadata.xml`.

SP dáta boli nastavené v kroku 2., a IdP dáta v kroku 5.



