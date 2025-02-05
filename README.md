# Prihlasovanie cez slovensko.sk - Single Sign-On - WebSSO

NASES (prevádzkovateľ slovensko.sk) poskytuje integrátorom možnosť využívať garantované overenie identity pomocou prihlasovania cez slovensko.sk.

Toto úložisko obsahuje ukážkové implementácie prihlasovania pomocou slovensko.sk (cez eID, Slovensko v mobile a iné) pre rôzne programovacie jazyky a frameworky. Ukážky by mali fungovať "out-of-the-box", s minimálnou konfiguráciou alebo inštaláciou.

**UPOZORNENIE: Pre produkčné použitie je potrebné prejst aj pomerne zložitým formálnym procesom integrácie s NASES. Detaily tohto procesu nájdete na [partner framework portáli](https://www.nases.gov.sk/sluzby/sluzby-pre-po-a-ovm/integracie).**

## Ukážka
https://github.com/user-attachments/assets/aa5534dc-f741-4229-8374-8f6ff4c7d024


## Predpoklady
1. **Prístup do testovacieho prostredia slovensko.sk**          
  Na to, aby ste mohli začať testovať prihlasovanie cez testovacie identity slovensko.sk budete potrebovať prístup na testovacie prostredie slovensko.sk (https://portal.upvsfixnew.gov.sk).  
  Prístup na toto prostredie získate až po registrácii do partner framework portálu a žiadosti zaslanej do NASES.
  Informácie ohľadom žiadania o vytvorenie infraštruktúrneho prepojenia sú uvedené v dokumente s názvom *Všeobecný popis integrácie OVM, PO* v sekcii Žiadosť o vytvorenie infraštruktúrneho prepojenia (FIX). Dokument sa nachádza na [partner framework portáli](https://www.nases.gov.sk/sluzby/sluzby-pre-po-a-ovm/integracie) v časti *Integrácia na ÚPVS*, *Ako začať*.


2. **Testovacie identity zriadené**  
  Na prihlasovanie v testovacom prostredí sa **NEDÁ** za bežných okolností použiť občiansky preukaz ani aplikácia Slovensko v mobile, používajú sa testovacie identity, ktoré sa prihlasujú menom a heslom. Správajú sa však rovnako. Môžete o ne požiadať NASES podľa postupu zverejneného na https://www.nases.gov.sk/sluzby/sluzby-pre-po-a-ovm/integracie/integracny-proces 
  Informácie ohľadom žiadania o testovacie identity sú uvedené v dokumente s názvom *Všeobecný popis integrácie OVM, PO* v sekcii *Žiadosť o zriadenie testovacích identít*. Dokument sa nachádza na [partner framework portáli](https://www.nases.gov.sk/sluzby/sluzby-pre-po-a-ovm/integracie) v časti *Integrácia na ÚPVS*, *Ako začať*.


3. **Zaregistrované service provider (SP) metadáta**  
  Ukážkové implementácie používajú už zaregistrované metadáta pre `127.0.0.1` a bežia na https://127.0.0.1:3001/  
  Ak chcete využívať inú adresu, je potrebné si zaregistrovať vlastné metadáta. Návod k registrácii a požiadavkam na SP metadáta: https://www.slovensko.sk/_img/CMS4/Navody/navod_poskytovatelia_sluzieb.pdf    

## Ukážkové implementácie
- [Ruby on Rails](/ruby-on-rails)
- [Java Tomcat s knižnicou Onelogin SAML Toolkit](/java-onelogin)
- [ASP.NET Core](/asp-net-core)
- [Node.js s knižnicou @node-saml/node-saml](/ts-node-saml-minimal)
- [Čisté PHP](/php)
- [PHP s frameworkom Laravel](/laravel)

## Odporúčania a upozornenia pre vlastnú implementáciu
Pre úspešnú implementáciu prihlasovania cez slovensko.sk je potrebné upozorniť na niekoľko dôležitých detailov.

1. Odporúčame začať spustením ukážkovej implementácie vo zvolenom programovacom jazyku (odporúčané knižnice, nastavenia,...) a až následne upravovať kód pre vlastnú implementáciu.
2. Odporúčame využívať rôzne certifikáty pre podpisovanie a šifrovanie. Nie každá knižnica pre SAML toto pokročilé nastavenie však podporuje.
3. Je nevyhnutné, aby vaša aplikácia podporovala všetky tri základné scenáre: 1x prihlasovania a 2x odhlasovania. Bez ich pochopenia a vhodnej implementácie, nie je možné prejsť do produkčnej prevádzky.  

### Používateľské scenáre
Pre úspešnú kompletnú implementáciu slovensko.sk loginu je potrebné podporovať a presne dodržať postup v nasledovných 3 scenároch: 

#### Prihlásenie používateľa
1. Redirect z SP portálu so SAML requestom na Single Sign-On Service adresu ÚPVS portálu.
2. ÚPVS portál spraví redirect na svoju prihlasovaciu stránku.
3. Používateľ zvolí spôsob prihlásenia a prihlási sa.
4. Používateľ zvolí, za ktorú identitu sa chce prihlásiť.
5. ÚPVS portál spraví redirect na Assertion Consumer Service adresu SP portálu, pričom zašle SAML assertion.
6. SP rozparsuje SAML assertion, získa potrebné údaje.
7. Používateľ je prihlásený na oboch portáloch (SP aj IdP).

#### Odhlásenie používateľa iniciované na strane SP (váš portál)
1. Odhlásenie používateľa na strane SP portálu.
2. Redirect z SP portálu so SAML requestom na Single Logout Service adresu ÚPVS portálu.
3. Automaticky sa vykonajú redirecty na strane IdP.
4. ÚPVS portál spraví redirect so SAML response na Single Logout Service adresu SP portálu.
5. Používateľ je odhlásený z oboch portálov (SP aj IdP).
6. Používateľ zostáva na SP portáli (tam, kde sa proces odhlasovania začal).

#### Odhlásenie používateľa iniciované na strane IdP (slovensko.sk)
1. Odhlásenie používateľa na IdP portáli.
2. ÚPVS portál spraví redirect so SAML requestom na Single Logout Service adresu SP portálu.
3. SP portál odhlási používateľa zo svojho portálu a spraví redirect so SAML response na Single Logout Service adresu ÚPVS portálu.
4. Automaticky sa vykonajú redirecty na strane IdP.
5. Používateľ je odhlásený z oboch portálov (SP aj IdP).
6. Používateľ zostáva na IdP portáli (tam, kde sa proces odhlasovania začal).

## ÚPVS FIX portál
https://portal.upvsfixnew.gov.sk/

## Autori

Prvú verziu pre Národnú agentúru pre sieťové a elektronické služby (NASES) vytvorila firma Služby Slovensko.Digital, s.r.o. v spolupráci s komunitiou Slovensko.Digital. 
