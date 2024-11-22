# ts-node-saml-minimal - minimalistic SAML SP in Node.js

## Setup

1. add `127.0.0.1 localhost.dev` to `/etc/hosts`
2. install mkcert `brew install mkcert` (or `choco install mkcert`) https://github.com/FiloSottile/mkcert#installation
3. run `mkcert -install` - install root certificate
4. run `mkcert localhost.dev` - generate certificate for localhost.dev

## Run

1. `npm install`
2. `npm run dev`
3. open https://localhost.dev:3001/

## Dictionary

- IdP - Identity Provider (ÚPVS)
- SP - Service Provider (táto aplikácia)
- SSO - Single Sign-On
- SLO - Single Log-Out

## Environment variables

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

## Repository structure

- `src` - source code
  - `metadata.ts` - metadata for IdP and SP
  - `server.ts` - main server file
  - `saml` - SAML related code, implemented in multiple libraries (`node-saml`, `saml2-js`, `samlify`)
  - `try` - small examples to try out parts of workflow when debugging
  - `utils.ts` - utility functions

## Routes

- `/` - home page, shows current user info (session)
- `/auth/saml/callback` - callback endpoint, registered at IdP
- `/auth/saml/logout` - logout callback endpoint, registered at Idp (initiated by SP)
- `/upvs/logout` - logout endpoint, registered at IdP (initiated by IdP)

## References

- https://web.dev/articles/how-to-use-local-https
