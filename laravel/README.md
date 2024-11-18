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
    nano .env
    ...
    APP_URL=https://localhost.dev:3001
    APP_PORT=3000
    SSL_PORT=3001
    SAML2_SP_CERT_x509="MIIC0jCCAbqgAwIBAgIJAIr0WzkIL6fiMA0GCSqGSIb3DQEBDQUAMBcxFTATBgNVBAMTDGljby04MzEzMDA2NjAeFw0yNDExMTIwODI1MTJaFw0yNjExMTIwODI1MTJaMBcxFTATBgNVBAMTDGljby04MzEzMDA2NjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKuc5o1O7CjDF0LME7tbuVkfjYeuVvAD5ZE0r/vROVkV1hkwQqwTb7/QCNRtt8x/jb04kf+tNk33cfDZ6Pz/MnsV3iuL/ZA4YF2ecisYPnpBY6UXzeBuWhsT+i0JBqrD5MQAkM/2eoztb5VM0DKLMPqs7iEmkSWsz2t7bg9j83Lt5kkaffJ/qSi2gMb0CJbW2t14QDKJQ7D0nxL3DTIttgg0IoFsX72/EZFLhoSNwbkX1wfGu+ruNi2GCvly9PCiYSMgMogs/lSGZVGlBZe2MJc2CR/5fvOL29ChVL8KU6LYeR8yenMELoK9SoyJK7qp0bGyqDxMA3ytkBWLIEuRNG0CAwEAAaMhMB8wHQYDVR0OBBYEFN4DCv8pla+6Qxji32jieReyWHeUMA0GCSqGSIb3DQEBDQUAA4IBAQBaxqfBP1pBaYQ5SkpGcNmMuRXtg457xhBn3f3rtQymz0IX/AUlaXQPUEdzT31p3gyE8MpuYB2l524dPbUnqjsfG5EPNKOpXWhVZPH6SzA0g66+L9nLbczZ3qBZ87HbofBTgmtu+U/e1kIoy/KK8FyJvc72Knb1CbI9DjSi4fpeK2WakI+i7INiF7sFXXpQ/M4JNhYRCZBQoVARP6oS3+Fv7tob0jGP7x8MrD4Q4cy5xTLCPWel+dYKLffzeRgAiYHerQmO3nPiVByX838NQd4Wx9Zsp+WUAjXz//m1AGJHxlqEZuloPNPLhMLzAl5pNGe+Vo4K07RygyFsaiYfnE0j"
    SAML2_SP_CERT_PRIVATEKEY="MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrnOaNTuwowxdCzBO7W7lZH42HrlbwA+WRNK/70TlZFdYZMEKsE2+/0AjUbbfMf429OJH/rTZN93Hw2ej8/zJ7Fd4ri/2QOGBdnnIrGD56QWOlF83gblobE/otCQaqw+TEAJDP9nqM7W+VTNAyizD6rO4hJpElrM9re24PY/Ny7eZJGn3yf6kotoDG9AiW1trdeEAyiUOw9J8S9w0yLbYINCKBbF+9vxGRS4aEjcG5F9cHxrvq7jYthgr5cvTwomEjIDKILP5UhmVRpQWXtjCXNgkf+X7zi9vQoVS/ClOi2HkfMnpzBC6CvUqMiSu6qdGxsqg8TAN8rZAViyBLkTRtAgMBAAECggEAALyJY8FbM5iUvLll+0ebPcXsJFEr99c4cL1WZQECmz6D/vMtUhI6SEszAoBfCc5hVBbOT5fVdBO0BjnVLWLF+2++VpcA9VG8niI8MLGnsPwfWpnFzSkEE3osOG3BvNFe5bVv6aiP4ZNyR2R/PzxIL0c3NWa2OEBr2nT65a+C37MiXGbiZ6Zv+mfMKb23IOrd0AGk3aQ38rJeBQVVVAsc+2qIV+TITy/6OlU8BE7HijYucBisIvIn1VbjZqUI1rUXdsKiDPhJZQBU05AdA3XERvHSggI8Z965c9v6S963hKjpqrQh+6WqsjNKhZRQscM2vHEhvvQXn90Jr+RSSToXAQKBgQDhCDSmedRhVQtlBvbelinkpYsunMcuc4V0CWgTbDYDDIi4wflNT9+HHh0tNuKQXrWguN9sjqVAqzuXJ5tYtBS2vaxPz6/chJBp9CTLCwNJt6lcICy2dcsMBalfUl8eF9PfBB0Irs8w8jU3ZFwOHo+aanAuxkhfQwONRsA5IIzRAQKBgQDDOsIQVC0ZF+llcV2J6QOtvnNxWoRVfNzhaUQFCSZTJ81PayOyp93MKJO/b/zL3xMdQHeYhpJuzPRx+CFaeveM8udtqdiBWeGooZhHrll79ROo1FerfsXAeG3rGHYQG85fvuDvzhVGgNeEXrXa3X6RtCbE7onUDV7fJUGGabU3bQKBgQCq1cjqrUifT6nj24Kk/oj1TPu5ukm4KPkiW1XIkPj8HZLZ+GBj4gRHFoR949HiWhQ23MK5Lh2kV5pYqTfVAnlLNflPadMPbRAZb8BS6JxpZWXMS5zGM+yextmLRQRy2xH8l6nXAqbGeMoPsD/2dBr+1lkuGVeuAjj7EsAxXlWpAQKBgFP+X6fuz0hQhVXjpD7FRZPmsHxAWVb+VXmVdHJGMXrtUOOuULl4h3BitM5UPArqeqrHJa01mKKbA0BVZOQsq3y0tOT1gfSE2xVWENImLNGr6z1jviRGcoYQShovd/wOOofu84+4tmaS4CZPKSZ0zROa0mM/zYSyC/MtcDeIGzMxAoGBAIi1kD8l1ikgQQUcmlUNBFd8/1O8vxxHGfMHZd/wqnAxlc+2ux0yvpVJOJsCuyh6h4LGgiHV7XB0QbLv/QFRE+CLnfqNRrUZbg3DN4ybqYG3tWBZ3Pw6xWS2Qm9CB4Q7EhwAsyl3Gg9CL9Rpw3n1dY6WnGzQx/hwbsSZ/jD6+VGs"
    SAML2_SP_ENTITYID="https://localhost.dev2"
    SAML2_LOGIN_URL="https://localhost.dev:3001/authenticated"
    SAML2_LOGOUT_URL="https://localhost.dev:3001/"
    SAML2_ERROR_URL="https://localhost.dev:3001/error"
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

6. Aplikácia beží na https://localhost.dev:3001 so self-signed SSL certifikátom.

## Metadáta
Metadáta v XML sa nachádzajú v priečinku `../security`.

V tomto projekte sú použité metadáta `localhost_dev_one_key/localhost_dev_fix.metadata.xml` pre SP,
ktoré sú nakonfigurované s rovnakým kľúčom pre encryption aj signing. Knižnica `onelogin/php-saml`, ktorú využíva knižnica `24slides/laravel-saml2` nepodporuje použitie
rôznych kľúčov pre encryption a signing.

Pre IdP sú použité metadáta `upvs_fix.metadata.xml`.

SP dáta boli nastavené v kroku 2., a IdP dáta v kroku 5.



