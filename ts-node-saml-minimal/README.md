# ts-node-saml-minimal - ukážka UPVS SAML SP pre Node.js

v tomto momente funguje iba `@node-saml/node-saml` implementácia, ale plán je pridať aj `saml2-js` a `samlify` implementácie

## Run

1. `npm install`, nainštaluje závislosti
2. `npm run dev`, spustí server
3. otvor https://localhost.dev:3001/

## Dictionary

- IdP - Identity Provider (ÚPVS), poskytovateľ identity
- SP - Service Provider (táto aplikácia), poskytovateľ služby, konzument identity
- SSO - Single Sign-On, jedno prihlásenie na viaceré služby
- SLO - Single Log-Out, jedno odhlásenie zo všetkých služieb

## Premenné prostredia

| Premenná                             | Popis                                                                                                  | Hodnota                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `UPVS_ENV`                           | Prostredie ÚPVS<sup>1</sup>                                                                            | `fix` (predvolená) alebo `prod` |
| `SP_METADATA_PATH`                   | Relatívna cesta ukazujúca na Service Provider metadáta pre autentifikáciu cez ÚPVS SSO                 |
| `UPVS_SSO_SP_SIGNING_PRIVATE_KEY`    | Hodnota Service Provider privátneho kľúča pre podpisovanie pri autentifikácii cez ÚPVS SSO<sup>2</sup> |
| `UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY` | Hodnota Service Provider privátneho kľúča pre šifrovanie pri autentifikácii cez ÚPVS SSO<sup>2</sup>   |

<sup>1</sup> Integračný manuál ÚPVS IAM dostupný na [Partner framewrok portáli](https://kp.gov.sk/pf)  
<sup>2</sup> Certifikát musí byť zaregistrovaný v prostredí ÚPVS

## Bezpečnostné súbory

| Súbor                                                                                         | Popis                    |
| --------------------------------------------------------------------------------------------- | ------------------------ |
| `../security/upvs_{UPVS_ENV}.metadata.xml`                                                    | Metadáta IdP<sup>1</sup> |
| `SP_METADATA_PATH`, napr. `../security/localhost_dev_two_keys/localhost_dev_fix.metadata.xml` | Metadáta SP<sup>1</sup>  |

## Štruktúra repozitára

- `src`
  - `metadata.ts` - metadáta pre IdP a SP
  - `server.ts` - hlavný súbor servera
  - `saml` - kód súvisiaci so SAML, implementovaný v rôznych knižniciach (`node-saml`, `saml2-js`, `samlify`)
  - `try` - malé príklady na vyskúšanie častí pracovného postupu pri ladení
  - `utils.ts` - pomocné funkcie

## Routes

- `/` - domovská stránka, zobrazuje informácie o aktuálnom používateľovi (session)
- `/auth/saml/callback` - callback endpoint, registrovaný na IdP
- `/auth/saml/logout` - logout callback endpoint, registrovaný na IdP (iniciovaný SP)
- `/upvs/logout` - logout endpoint, registrovaný na IdP (iniciovaný IdP)
