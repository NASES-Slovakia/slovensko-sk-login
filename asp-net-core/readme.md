# ASP.NET Core example

> based on [https://github.com/Sustainsys/Saml2.Samples/tree/main/v2/AspNetCore](https://github.com/Sustainsys/Saml2.Samples/tree/b98a83541ef1d36273fc2b4cb2eb5fa8d7bf4bf6/v2/AspNetCore)
> [nuget Sustainsys.Saml2.AspNetCore2](https://www.nuget.org/packages/Sustainsys.Saml2.AspNetCore2)

```sh
./
├───RazorPagesExample/
│   ├───Configurations/
│   │   └───Configuration.cs # configuration C# POCO objects
│   ├───Pages/ # razor pages root
│   ├───Properties/
│   └───wwwroot/ # razor pages assets
│   └───appsettings.json # configurataion file (Service Provider, Identity Provider, etc..)
│   └───localhost.crt # certificate
│   └───localhost.key # private key
│   └───Program.cs # Generic host creation + execution
│   └───RazorPagesExample.csproj
├───.editorconfig # roslyn analyzers definitions
├───global.json # required dotnet sdk definition
└───NASESeID.sln
```

## Prerequsities

* `net9 sdk` (see https://learn.microsoft.com/en-us/dotnet/core/install/ for more info)
  * **Windows 10 (build 1809+) / Windows 11**
    ```pwsh
    winget install Microsoft.DotNet.SDK.9
    ```
  * **Linux**
    ```bash
    wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
    chmod +x ./dotnet-install.sh
    ./dotnet-install.sh --version 9.0.100
    ```
  ```

## How to run sample

```sh
cd ./RazorPages
dotnet run
```

## FAQ

### Update certificate and update keys

**generate pfx**
```sh
pushd ./RazorPages/
openssl pkcs12 -export -out localhost.pfx -inkey localhost.key -in localhost.crt -passout pass:abcd
popd
```

### Https certificate not installed

```sh
dotnet dev-certs https --trust
```

