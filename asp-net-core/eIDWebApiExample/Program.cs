using System.Security.Cryptography.X509Certificates;

using Microsoft.AspNetCore.Authentication.Cookies;

using Sustainsys.Saml2;
using Sustainsys.Saml2.AspNetCore2;
using Sustainsys.Saml2.Configuration;
using Sustainsys.Saml2.Metadata;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services
    .AddAuthentication(opt =>
    {
        // Default scheme that maintains session is cookies.
        opt.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        // If there's a challenge to sign in, use the Saml2 scheme.
        opt.DefaultChallengeScheme = Saml2Defaults.Scheme;
    })
.AddCookie()
.AddSaml2(sharedOptions =>
{
    var samlConfig = builder.Configuration.GetSection("Saml").Get<SamlConfig>();

    sharedOptions.SPOptions.EntityId = new EntityId(samlConfig.ServiceProvider.Id);
    
    var certificate = new X509Certificate2(samlConfig.ServiceProvider.Certificate.Path, samlConfig.ServiceProvider.Certificate.Key);
    sharedOptions.SPOptions.ServiceCertificates.Add(certificate);
    sharedOptions.SPOptions.AuthenticateRequestSigningBehavior = SigningBehavior.Always;
    sharedOptions.SPOptions.MinIncomingSigningAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    sharedOptions.SPOptions.OutboundSigningAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";

    sharedOptions.IdentityProviders.Add(new IdentityProvider(
            new EntityId(samlConfig.IdentityProvider.Id), sharedOptions.SPOptions)
    {
        MetadataLocation = Path.Combine(AppContext.BaseDirectory, samlConfig.IdentityProvider.MetadataLocation),
        LoadMetadata = true,
        WantAuthnRequestsSigned = true
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

app.MapGet("/auth/saml/logout", (HttpContext context, ILogger<Program> logger) =>
{
    //handle logout SAMLResponse if needed
    if (context.Request.Query.TryGetValue("SAMLResponse", out var samlResponse))
    {
        logger.LogInformation("Logout succesfull: {SAMLResponse}", samlResponse!);
    }

    return Results.Redirect("/");
});

app.Run();


