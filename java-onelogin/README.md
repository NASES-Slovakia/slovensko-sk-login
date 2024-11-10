# O čom to je

Toto demo ukazuje, ako sa dá použiť vo vašej Tomcat aplikácii websso prihlasovanie voči Slovensko.sk s použitím knižnice SAML Java Toolkit od Onelogin. 
Nanešťastie táto knižnica nepodporuje rozdielne kľúče a certifikáty pre podpisovanie a šifrovanie.
Tak sme si ju museli upraviť a pridať tam ďalšie dva konfiguračné parametre.

# Inštalácia

Takže krok 1. - stiahnite si https://github.com/archimetes/java-saml a zbuildujte si ho.

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
* do etc/host si treba pridať `127.0.0.1  localhost.dev`
* otvoriť si stránku https://localhost.dev:3001/ a pridať si jej certifikát medzi dôveryhodné

Keby sa vám nepáčila myšlienka, že budete dôverovať certifikátu stiahnutému z internetov, tak si vygenerujte nový. 
Najprv vymažte starý keystore a potom:
```
keytool -genkey -keyalg RSA -noprompt -alias tomcat -dname "CN=localhost.dev, OU=NA, O=NA, L=NA, S=NA, C=NA" -keystore bind-mounts/portal/usr/local/tomcat/conf/localhost-rsa.jks -validity 9999 -storepass changeme -keypass changeme
```
# Podrobnosti

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

## Generovanie certifikátov
TODO

Po vygenerovaní certifikátov is ich dajte do webssodemo.saml.properties a potom si kliknite na link SP metadáta /sp-metadata.xml v pätičke.
Vygenerovný súbor môžete použiť na registráciu v NASESE.


