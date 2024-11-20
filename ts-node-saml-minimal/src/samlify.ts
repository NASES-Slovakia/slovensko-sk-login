import fs from "fs";
import saml from "samlify";
import {
  PATH_IDP_METADATA,
  PATH_SP_METADATA,
  sp_metadata,
  UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY,
  UPVS_SSO_SP_SIGNING_PRIVATE_KEY,
} from "./metadata";

function pemWrap(header: string, body: string) {
  return `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`;
}

export const service_provider = saml.ServiceProvider({
  metadata: fs.readFileSync(PATH_SP_METADATA, "utf8"),
  privateKey: pemWrap("PRIVATE KEY", UPVS_SSO_SP_SIGNING_PRIVATE_KEY),
  encPrivateKey: pemWrap("PRIVATE KEY", UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY),
  requestSignatureAlgorithm:
    "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512",
  nameIDFormat: ["urn:oasis:names:tc:SAML:2.0:nameid-format:transient"],
  allowCreate: true,
  // transformationAlgorithms: [
  //   "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
  //   "http://www.w3.org/2001/10/xml-exc-c14n#",
  // ],
});

export const identity_provider = saml.IdentityProvider({
  metadata: fs.readFileSync(PATH_IDP_METADATA, "utf8"),
  encPrivateKey: pemWrap("PRIVATE KEY", UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY),
  privateKey: pemWrap("PRIVATE KEY", UPVS_SSO_SP_SIGNING_PRIVATE_KEY),
  requestSignatureAlgorithm:
    "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512",
  nameIDFormat: ["urn:oasis:names:tc:SAML:2.0:nameid-format:transient"],
});

export function samlifyGetLoginUrl() {
  const req = service_provider.createLoginRequest(
    identity_provider,
    "redirect"
  );
  console.log(req.context);
  console.log(
    req.context
      .split("?")[1]
      .split("&")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {})
  );
  return req.context;
}
