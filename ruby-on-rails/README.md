# Ruby on Rails slovensko.sk login

Pred prvým spustením je potrebné pripraviť:
* [.env](.env) s doplnenými hodnotami [premenných prostredia](#premenné-prostredia) podľa potreby,
* všetky [bezpečnostné súbory](#bezpečnostné-súbory), ktoré komponent požaduje podľa upraveného `.env` súboru.

## Konfigurácia
Zoznam premenných prostredia a bezpečnostných súborov potrebných pre spustenie.

#### Premenné prostredia:
Premenná | Popis                                                                                                  | Hodnota
--- |--------------------------------------------------------------------------------------------------------| ---
`UPVS_ENV` | Prostredie ÚPVS<sup>1</sup>                                                                            | `fix` (predvolená), `dev` alebo `prod`
`UPVS_SSO_SUBJECT` | Subjekt ukazujúci na Service Provider metadáta pre autentifikáciu cez ÚPVS SSO                         
`UPVS_SSO_SP_CERTIFICATE` | Hodnota Service Provider certifikátu pre podpisovanie, šifrovanie pri autentifikácii cez ÚPVS SSO<sup>2</sup>      
`UPVS_SSO_SP_PRIVATE_KEY` | Hodnota Service Provider privátneho kľúča pre podpisovanie, šifrovanie pri autentifikácii cez ÚPVS SSO<sup>2</sup>

<sup>1</sup> Integračný manuál ÚPVS IAM  
<sup>2</sup> Certifikát musí byť zaregistrovaný v prostredí ÚPVS

#### Bezpečnostné súbory:
Súbor | Popis
--- | --- 
`security/upvs_{UPVS_ENV}.metadata.xml` | Metadáta IdP<sup>1</sup>
`security/{SSO_SP_SUBJECT}_{UPVS_ENV}.metadata.xml` | Metadáta SP<sup>1</sup>

<sup>1</sup> Metadáta IdP / SP musia byť zaregistrované v prostredí ÚPVS

## Testovacie identity
* TODO: toto by sme asi aj do hlavneho adresara mohli dat (nezavisle od platformy), aby si to bolo mozne rychlo skusit s nejakym zdielanym loginom - mohol by NASES dat nejake identity pre tento ucel, nedavajme nase

## Na čo si dať pozor
* TODO: toto by sme asi aj do hlavneho adresara mohli dat (nezavisle od platformy) a spisat tam, ze sa treba venovat obom scenarom pre odhlasenie a taketo specialitky
