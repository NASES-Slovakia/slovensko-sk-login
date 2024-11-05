# slovensko.sk login

## Predpoklady
- Zaregistrované SP metadáta vo zvolenom ÚPVS prostredí.<sup>1</sup>
- ÚPVS metadáta pre zvolené prostredie k dispozícii.

## Odporúčania
- Odporúča sa využívať rôzne certifikáty pre podpisovanie a šifrovanie, aj keď to IdP zatiaľ nevyncuje.<sup>1</sup>
- Odporúča sa ísť podľa ukážkovej implementácie vo zvolených programovacích jazykoch (odporúčané knižnice, nastavenia,...)

## Ukážková implementácia
- [ruby on rails](/ruby-on-rails)

<sup>1</sup> Návod k registrácii a požiadavkam na SP metadáta: https://www.slovensko.sk/_img/CMS4/Navody/navod_poskytovatelia_sluzieb.pdf

## Scenáre
Pre úspešnú kompletnú implementáciu slovensko.sk loginu je potrebné podporovať a presne dodržať postup v nasledovných 3 scenároch. 

### Prihlásenie používateľa
1. Redirect z SP portálu so SAML requestom na Single Sign On Service adresu ÚPVS portálu.
2. ÚPVS portál spraví redirect na svoju prihlasovaciu stránku.
3. Používateľ zvolí spôsob prihlásenia a prihlási sa.
4. Používateľ zvolí, za ktorú identitu sa chce prihlásiť.
5. ÚPVS portál spraví redirect na Assertion Consumer Service adresu SP portálu, pričom zašle SAML assertion.
6. SP rozparsuje SAML assertion, získa potrebné údaje.
7. Používateľ je prihlásený na oboch portáloch (SP aj IdP).

### Odhlásenie používateľa iniciované na strane SP
1. Odhlásenie používateľa na strane SP portálu.
2. Redirect z SP portálu so SAML requestom na Single Logout Service adresu ÚPVS portálu.
3. Automaticky sa vykonajú redirecty na strane IdP.
4. ÚPVS portál spraví redirect so SAML response na Single Logout Service adresu SP portálu.
5. Používateľ je odhlásený z oboch portálov (SP aj IdP).
6. Používateľ zostáva na SP portáli (tam, kde sa proces odhlasovania začal).

### Odhlásenie používateľa iniciované na strane IdP
1. Odhlásenie používateľa na IdP portáli.
2. ÚPVS portál spraví redirect so SAML requestom na Single Logout Service adresu SP portálu.
3. SP portál odhlási používateľa zo svojho portálu a spraví redirect so SAML response na Single Logout Service adresu ÚPVS portálu.
4. Automaticky sa vykonajú redirecty na strane IdP.
5. Používateľ je odhlásený z oboch portálov (SP aj IdP).
6. Používateľ zostáva na IdP portáli (tam, kde sa proces odhlasovania začal).

## ÚPVS FIX portál
Adresa: https://portal.upvsfixnew.gov.sk/sk/titulna-stranka

### Prístup - VPN
TODO

### Testovacie identity
Na ÚPVS FIX portáli je možné prihlásiť sa pomocou mena a hesla.

  Login na [ÚPVS FIX portál](https://portal.upvsfixnew.gov.sk) | Heslo
  --- | ---
  `E0005182537` | `Poprad@Ta3`
