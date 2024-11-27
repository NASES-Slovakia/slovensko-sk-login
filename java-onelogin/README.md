# Java-saml slovensko.sk login

Tomcat aplikácii s websso prihlasovaním voči Slovensko.sk s použitím knižnice [SAML Java Toolkit od Onelogin](https://github.com/SAML-Toolkits/java-saml). 

## Rozdielne kľúče pre podpisovanie a šifrovanie

Pri tejto integrácii je možné v NASESe zaregistrovať service provider metadáta s rozdielnymi kľúčmi a certifikátmi pre podpisovanie a šifrovanie.
Java-saml od Onelogin ale podporuje nastavenie iba jedného rovnakého certifikátu a kľúča pre obe použitia, čo je pri SAML bežné.

Ak ale naozaj potrebujete nastaviť rozdielne certifikáty a kľúče, použite tento [fork java-saml od Archimetes](https://github.com/archimetes/java-saml).
Fork si potrebujete lokálne zbuildovať, nainštalovať a v `pom.xml` použiť túto verziu `2.9.1-SK`.
Konfigurácia pre tento scenár je uložená v: [two_keys_setup.webssodemo.saml.properties](bind-mounts/portal/usr/local/tomcat/conf/two_keys_setup.webssodemo.saml.properties)

## Inštalácia

Zbuildujte si tento projekt:
```
mnv clean install
```
Výsledný artefakt ROOT.war sa nakopíruje do bind-mounts/portal/usr/local/tomcat/webapps kde už je dostupný pre Tomcat. 
Stačí už len spustiť kontajner s Tomcatom:
```
docker compose up -d 
```
A aby sme si to celé mohli aj pozrieť, treba ešte nasledovné veci:
* VPN na FIX prostredie Slovensko.sk
* otvoriť si stránku https://127.0.0.1:3001/ a pridať si jej certifikát medzi dôveryhodné

## Konfigurácia pre java-saml

Konfiguračný súbor pre SAML toolkit býva uložený na classpath pod názvom *onelogin.saml.properties*. 
Pre účely testovania a vývoja je ale výhodnejšie, keď je uložný mimo classpath a načítava vždy nanovo. Od toho máme triedu [Settings.java](src/main/java/com/archimetes/cgpcon/websso/Settings.java), 
ktorá číta konfiguráciu z [webssodemo.saml.properties](bind-mounts/portal/usr/local/tomcat/conf/webssodemo.saml.properties). 
Tento súbor obsahuje veľmi dobré komentára od autora takže to tu nemusím podrobne vysvetlovať. Hodnoty, ktoré budete meniť sú:

Pre service providera, teda pre vás:

* onelogin.saml2.sp.entityid - Je to síce URL adresa ale táto konkrétne nemusí existovať
* onelogin.saml2.sp.assertion_consumer_service.url - tak toto už musí existovať, host musí byť dostupný z klienta a cesta je hodnota pre servlet mapping samlcallbackServlet vo [web.xml](src/main/webapp/WEB-INF/web.xml)
* onelogin.saml2.sp.single_logout_service.url - to isté pre SingleLogoutServiceServlet. 
* onelogin.saml2.sp.x509cert_enc - Base64 kódovaný certifikát pre šifrovanie 
* onelogin.saml2.sp.privatekey_enc - jeho klúč
* onelogin.saml2.sp.x509cert - certifikát pre podpisovanie
* onelogin.saml2.sp.privatekey - a klúč

Pre Identity providera okopírujete hodnoty, čo ste dostali od NASESu v metadátovom XML
* onelogin.saml2.idp.entityid=https://prihlasenie.upvsfix.gov.sk/oam/fed
* onelogin.saml2.idp.single_sign_on_service.url=https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20
* onelogin.saml2.idp.single_logout_service.url=https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20
* onelogin.saml2.idp.single_logout_service.response.url=https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20
* onelogin.saml2.idp.x509cert=MIIDXjCCAkagAwIBA................=



