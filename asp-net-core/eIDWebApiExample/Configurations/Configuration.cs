public record SamlConfig(ServiceProviderConfig ServiceProvider, IdentityProviderConfig IdentityProvider);
public record ServiceProviderConfig(string Id, CertificateConfig Certificate);
public record CertificateConfig(string Path, string Key);
public record IdentityProviderConfig(string Id, string MetadataLocation);
