# ASP.NET Core slovensko.sk login

- Implementované na základe: https://github.com/Sustainsys/Saml2.Samples/tree/b98a83541ef1d36273fc2b4cb2eb5fa8d7bf4bf6/v2/AspNetCore

## Predpoklady

[net9 sdk](https://learn.microsoft.com/en-us/dotnet/core/install/)
  * **Windows 10 (build 1809+) / Windows 11 inštalácia**
    ```pwsh
    winget install Microsoft.DotNet.SDK.9
    ```
  * **Linux inštalácia**
    ```
    wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
    chmod +x ./dotnet-install.sh
    ./dotnet-install.sh --version 9.0.100
    ```
    
## Spustenie
### Vygenerovani pfx súboru (treba spustiť po každej zmene kľúčov)
```sh
pushd ./RazorPages/
openssl pkcs12 -export -out localhost.pfx -inkey localhost.key -in localhost.crt -passout pass:abcd
popd
```

### Trust self-signed SSL certifikátu
```sh
dotnet dev-certs https --trust
```

### Spustenie servera
```sh
cd ./RazorPages
dotnet run
```

