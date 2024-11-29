/**
 * requires `@node-saml/node-saml` npm package
 */
import { Profile, SAML } from "@node-saml/node-saml";
import { idp_metadata, sp_metadata } from "./metadata.js";
import { pemWrap, printSamlRequestUrl } from "./utils.js";

// Create SAML instance
export const saml = new SAML({
  // Our url where we will receive SAML response
  callbackUrl: sp_metadata.assertion_consumer_service_url,
  logoutUrl: idp_metadata.single_logout_service_url,
  acceptedClockSkewMs: 1000,

  // the IDP's public signing certificate used to validate the signatures of the incoming SAML Responses,
  // Important, provided public key MUST always be in PEM format!
  idpCert: [
    pemWrap("CERTIFICATE", idp_metadata.x509_signing_cert),
    pemWrap("CERTIFICATE", idp_metadata.x509_encryption_cert),
  ],

  // optional private key that will be used to attempt to decrypt any encrypted assertions that are received
  decryptionPvk: pemWrap("PRIVATE KEY", sp_metadata.encryption_private_key),

  // the service provider's public signing certificate used to embed in AuthnRequest in order for the IDP to validate the signatures of the incoming SAML Request
  publicCert: pemWrap("CERTIFICATE", sp_metadata.sigining_cert),

  // To sign authentication requests,
  privateKey: pemWrap("PRIVATE KEY", sp_metadata.signing_private_key),

  passive: false,
  forceAuthn: false,

  // Our unique url
  issuer: sp_metadata.entity_id,

  // identity provider entrypoint - Url of SAML server
  entryPoint: idp_metadata.single_sign_on_service_url,

  authnRequestBinding: "HTTP-POST",

  wantAuthnResponseSigned: true,
  wantAssertionsSigned: true,
  allowCreate: true,
  signatureAlgorithm: "sha256",
  digestAlgorithm: "sha256", // careful not to raise it to sha512, as upvs is not supporting it at the time of writing

  identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  logoutCallbackUrl: sp_metadata.single_logout_service_url,
  disableRequestedAuthnContext: true,
});

/**
 * Unused parameter, it will be removed in future version of `@node-saml/node-saml`
 */
const SAML_HOST_UNUSED_PARAM = undefined;

/**
 * Get the URL to redirect to for login on the IDP
 */
export async function getIdpLoginUrl(): Promise<string> {
  const message = await saml.getAuthorizeMessageAsync(
    "",
    SAML_HOST_UNUSED_PARAM,
    {}
  );
  const req = message.SAMLRequest;
  if (!req) {
    throw new Error("SAMLRequest is missing");
  }

  const login_url = await saml.getAuthorizeUrlAsync(
    "",
    SAML_HOST_UNUSED_PARAM,
    {}
  );
  printSamlRequestUrl(login_url);
  return login_url;
}

/**
 * Get the URL to redirect to for logout on the IDP
 */
export async function getIdpLogoutUrl(obj?: {
  profile: Profile;
}): Promise<string> {
  if (!obj) {
    throw new Error("Profile is missing");
  }
  return saml.getLogoutUrlAsync(obj.profile, "", {});
}

/**
 *
 * @param query
 * @param originalQuery
 * @returns
 */
export async function validateRedirectResponse(
  query: Record<string, string>,
  originalQuery: string
) {
  return saml.validateRedirectAsync(query, originalQuery);
}

/**
 *
 * @param samlLogoutRequestProfile profile which to logout
 * @param logOutSuccess if the logout was successful
 * @returns {Promise<string>} URL to redirect to after logout
 */
export async function getLogoutReplyUrl(
  samlLogoutRequestProfile: Profile,
  logOutSuccess: boolean
) {
  return saml.getLogoutResponseUrlAsync(
    samlLogoutRequestProfile,
    "",
    {},
    logOutSuccess
  );
}

/**
 *
 * @param body
 * @returns
 */
export async function validatePostResponse(body: Record<string, string>) {
  return saml.validatePostResponseAsync(body);
}
