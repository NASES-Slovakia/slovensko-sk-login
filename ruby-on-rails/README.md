# Ruby on Rails slovensko.sk login

## Použité knižnice
- [omniauth-saml](https://github.com/omniauth/omniauth-saml)
- [ruby-saml](https://github.com/SAML-Toolkits/ruby-saml)

## Spustenie
Aplikácia je nakonfigurovaná, stačí spustiť `bin/setup` pre prvotné nastavanie alebo `bin/dev` pre ďalšie spustenia. Aplikácia beží na https://localhost.dev:3001 so self-signed SSL certifikátom. 

### Premenné prostredia:
Premenná | Popis                                                                                                  | Hodnota
--- |--------------------------------------------------------------------------------------------------------| ---
`UPVS_ENV` | Prostredie ÚPVS<sup>1</sup>                                                                            | `fix` (predvolená) alebo `prod`
`SP_METADATA_PATH` | Relatívna cesta ukazujúca na Service Provider metadáta pre autentifikáciu cez ÚPVS SSO                         
`UPVS_SSO_SP_SIGNING_PRIVATE_KEY` | Hodnota Service Provider privátneho kľúča pre podpisovanie pri autentifikácii cez ÚPVS SSO<sup>2</sup>
`UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY` | Hodnota Service Provider privátneho kľúča pre šifrovanie pri autentifikácii cez ÚPVS SSO<sup>2</sup>

<sup>1</sup> Integračný manuál ÚPVS IAM dostupný na [Partner framewrok portáli](https://kp.gov.sk/pf)  
<sup>2</sup> Certifikát musí byť zaregistrovaný v prostredí ÚPVS

### Bezpečnostné súbory:
Súbor | Popis
--- | --- 
`../security/upvs_{UPVS_ENV}.metadata.xml` | Metadáta IdP<sup>1</sup>
`SP_METADATA_PATH`, napr. `../security/localhost_dev_two_keys/localhost_dev_fix.metadata.xml` | Metadáta SP<sup>1</sup>

<sup>1</sup> Metadáta IdP / SP musia byť zaregistrované v prostredí ÚPVS

## Flow jednotlivých scenárov
### Prihlásenie používateľa
1. Začiatok procesu prihlásenia na `/upvs/login` endpointe, spracovanie v [UpvsController](app/controllers/upvs_controller.rb#L5).
2. Redirect so SAML Response z ÚPVS portálu na `/auth/saml/callback` endpoint, spracovanie v [UpvsController](app/controllers/upvs_controller.rb#L9-L12).
3. Prihlásený používateľ.

### Odhlásenie používateľa iniciované na strane SP
1. Začiatok procesu odhlásenia na `/upvs/logout` endpointe, spracovanie v [UpvsController](app/controllers/upvs_controller.rb#L22-L23).
2. Redirect so SAML Response z ÚPVS portálu na `auth/saml/logout` endpoint, spracovanie knižnicou.
3. Odhlásený používateľ.

### Odhlásenie používateľa iniciované na strane IdP
1. Redirect so SAML Requestom z ÚPVS portálu na `/upvs/logout` endpoint, spracovanie v [UpvsController](app/controllers/upvs_controller.rb#L17-L18).
2. Redirect so SAML Response na ÚPVS portál.
3. Odhlásený používateľ.
