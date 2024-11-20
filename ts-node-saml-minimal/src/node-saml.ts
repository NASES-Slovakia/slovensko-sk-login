import { SAML } from "@node-saml/node-saml";
import {
  idp_metadata,
  sp_metadata,
  UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY,
  UPVS_SSO_SP_SIGNING_PRIVATE_KEY,
} from "./metadata";

function pemWrap(header: string, body: string) {
  return `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`;
}

// const metadata = generateServiceProviderMetadata({
//   issuer: "https://example.com",
//   callbackUrl: "https://example.com/callback",
// });

// console.log(metadata);

// Create SAML instance
export const saml = new SAML({
  // Our url where we will receive SAML response
  callbackUrl: sp_metadata.assertion_consumer_service_url,

  // the IDP's public signing certificate used to validate the signatures of the incoming SAML Responses,
  // Important, provided public key MUST always be in PEM format!
  idpCert: idp_metadata.x509_signing_cert,

  // optional private key that will be used to attempt to decrypt any encrypted assertions that are received
  decryptionPvk: pemWrap("PRIVATE KEY", UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY),

  // the service provider's public signing certificate used to embed in AuthnRequest in order for the IDP to validate the signatures of the incoming SAML Request
  publicCert: pemWrap("CERTIFICATE", sp_metadata.sigining_cert),
  // To sign authentication requests,
  privateKey: pemWrap("PRIVATE KEY", UPVS_SSO_SP_SIGNING_PRIVATE_KEY),

  // "-----BEGIN PRIVATE KEY-----\n" +
  // UPVS_SSO_SP_SIGNING_PRIVATE_KEY +
  // "\n-----END PRIVATE KEY-----",

  passive: false,
  forceAuthn: false,
  //   signMetadata: true,

  // Our unique url
  issuer: sp_metadata.entity_id,
  // identity provider entrypoint - Url of SAML server
  entryPoint: idp_metadata.single_sign_on_service_url,
  // racComparison: "minimum",

  authnRequestBinding: "HTTP-Redirect",

  wantAuthnResponseSigned: false,
  wantAssertionsSigned: false,
  allowCreate: true,
  signatureAlgorithm: "sha512",
  digestAlgorithm: "sha512",

  // validateInResponseTo: ValidateInResponseTo.ifPresent,
  identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  logoutCallbackUrl: sp_metadata.single_logout_service_url,
  disableRequestedAuthnContext: true,
});

const samlHostUnused = undefined;

console.log({
  getAuthorizeMessageAsync: await saml.getAuthorizeMessageAsync(
    "",
    samlHostUnused,
    {}
  ),
});

export async function getLoginUrl() {
  const message = await saml.getAuthorizeMessageAsync("", samlHostUnused, {});
  const params = new URLSearchParams();
  const req = message.SAMLRequest;
  if (!req) {
    throw new Error("SAMLRequest is missing");
  }
  console.log({ req });

  params.append("SAMLRequest", req.toString());
  return idp_metadata.single_sign_on_service_url + "?" + params.toString();

  // return saml.getAuthorizeUrlAsync("", samlHostUnused, {});
}

export async function getLoginForm() {
  return saml.getAuthorizeFormAsync("", samlHostUnused, {});
}

console.log("https://localhost.dev:3001/login");

// ruby: https://prihlasenie.upvsfix.gov.sk/oamfed/idp/samlv20?SAMLRequest=lVZXj6PKEn6%2Fv8LyPuyD5aEJDlg7IxEcsE00eLBfrghNTqYJxr%2F%2BYM%2FsnJ29e%2FfskRCiiqqvK3xd3d%2BQlSbFgqmrINPgpYaoGjAIwbIK84zLM1SnsDzAsgkdaGj752FQVQVaYFiSO1YS5Kh6cmGzIAHAMasHwe54WP8rsS0nHg74HjDMrDva375FGQaJhWAWwqe6aJAXXp%2F8vHlCMZZbqQddLHSLB1JDgOFglZcOfET4PPSsBMHhQOCfh%2F%2BdzcDEm3uTMU5MyTFlE2BsExM4dmcUBSngUqRt9aZIsRAKG%2Fi3M0I1FDJUWVn1PCQAQY1xfIzTOj5ZkMQCTM7DgVLmVe7kCRtmbpj5z8O6zBa5hUK0yKwUokXlLA6MuF8QT2BhvxmhxUbXlbEiH%2FTh4AhL9Ei6NxgOrmmSocU9o98jWd9L%2F6NL8Xuf4j3U4cu3u%2FXikV758stGfcN%2BNPnmosUh9Pv21CV8X9BFz1%2Fvrr1n27ZPLfmUlz5GAAAwQGO9jYtC%2F8vXD1%2FoCpmXP0TOyvIs7FcLb4%2BGi7AKcnfAJH5ehlWQ%2Fh9gHMPBHXgMr87Ywansy1fsc2h%2FDASo7xGO07yEX0pkjVFgTXDiHVKDHixh5sCBoQnPX7%2F8EYfektVLK0NeXqbos%2FiPYX0qHMwamOQFdMfoe3bvof054C8K9vINOgshc5L6znTpzpHCciDqeQz73bUPUdVn60LPqpNq8CDV4z1w0eB6f8JB6n59pwB0%2FlWnsB%2BD%2F0l8qxUf%2Bv0Y%2BJdd7Lv05VPv3lCOVlLDF6f0z83pNa5xUZpxpMIJeQcoOuKdSFRTelNtSgS2oWt0wlSsWMXjEgkax%2BSkxeR%2F8gOtkUt3yZw0ni6zUWaV0mmyy1P%2F%2BfkR%2Fo8rPRQftHkTf%2BL9B0%2FfPLI4OvOixDTkJVhvblke2pEjKfuZLQMpo6TyBIHGY8CKXlt4OpauS6EdY1zMq1uFG93TjJRkAbcsFE6CIkvLuWP7wbagduwMh7cIdKoIj8cKq5zdnBF2Hb%2Brmxu57lixXsILpW3Kxo3TGSYD7HTYERWqt0rJErfMCGrcpvSUp9VYT%2FDCY9pXhWwamqPLhL%2BkrJiDFlu1cengo4Nmrn1d4gDPGDdvn26TjnGIBKqpYa6dkXBqQq9STSLe3Ug0WYZSmFWjQhmJF0feAb6VqHiuAqM7s5VLENIuc6VTk%2B1s3MRubJSwCZXyBsLngF%2FW9lwqLteLMPcAHBn7kUTiNhatMV7GVh02Y2NDfW%2FNT7W%2Bl38Hu49WmBNA81ZlfQjcfZx6%2FVCq4IsoCByIOI6xLz7TCizjC1tGSCTMcm%2BsvPVFBqy5w2V9EGySV5csrxqMyDrXlc7orC8dWUbU%2BXUS2T3VxNvyJvIMIUUMXLWgk%2FjlVdSXrcwLQOJd66GLPuv%2BGauP7SC0vHra7vKzEDSOxPRxsCrD%2B%2F5SYfj%2Bv5pz%2FTfL7HcHEXWxSkXAVnjlMjuqM3q5MtqCNG3z5nTCrN4eIkafTVdkaDt0cLmRm2ab7meaJ9IAkw1MrdH0EqaTrWdODwn3Ghqc6sLJ5HDWHP8y2iey6zAeh%2Bl7dy2ftow673JMLNb%2BqxJYYl0Gl3jOxP5EibHrNqih3kjLmOoSxEZldvTqkJS2uO7laQeyOjYjbkSnpM6r17w5VkvCEuaxCXbdqGuQNLVWeftKtftCPUtdm%2B81yZDkya2yDHZzxo1da%2FhutDah5LsMUyeMZe8nwNSW0mFuOvvKjZlMnYtV1M1yfhPNd33XoyjuDLc7%2B5wmX0fBxk%2FhnMnZW4cRk2W53EXs1Z8aV1bAaG%2B6vuoAcUy7ZBhLDER23m7UE3%2FUgMyyp%2BVKmM4D8UyKx419q1NNy874Abis%2Baq4v%2BINQ%2FX8UjmFOXInDIZTQ2ZmBe%2B5rx0yVEvV1nGbcQU5iZyTl1rxwXdMStMVAevQnIiruXUlX4Wz4%2FQjY8Rdi4IPu%2BV1tNGK6pjF6umsltbRUkywpjfcaANY1jhiSV9LbhfgJiqSKOVXvn6UOcqUtw5fnZeTq3oI9H2U8PaNvskuVTTmcUXaoipfPF7q5JbtKibDb1PKP91A7uzMet9MWMAqYQDbDGS6T7lcaW7MGkLMm%2BUz20scRpnqSbSn9wS9UzfipXROVd1y%2B4MWp92rYRDma3CmbkksH2dUFh%2Fm5wlO25mehOCS0CO1Ol9nZ85W7QJXtqtT6sxSdb4PI0tYR8J2IstHs9SUjo3bqVFpXVYl4mMQ%2FLy5P5Rv2x%2F7cTB8Ghxvt6RicT8kBV7Jk9Dp%2BkMpyVuuhD3S87Aqa%2Fi4daZW9fur110TumPvYbqo7qdeCLNqeD8V%2F%2Fdi%2FfIX

// console.log(
//   saml.generateServiceProviderMetadata(
//     sp_metadata.encryption_cert,
//     idp_metadata.x509_signing_cert
//   )
// );
