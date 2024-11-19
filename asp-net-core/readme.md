# ASP.NET Core example

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


## How to run

```pwsh
cd ./eIDWebApiExample
dotnet run
```