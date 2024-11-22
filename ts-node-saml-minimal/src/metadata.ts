import fs from "fs";
import path from "path";
import dotenv from "dotenv"; // we use dotenv because of multiline values
import { __dirname } from "./utils.js";
import { XMLParser } from "fast-xml-parser";
dotenv.config({
  path: ".env.development",
});

// Load environment variables
export const SP_METADATA_PATH = assertIsDefined(
  process.env.SP_METADATA_PATH,
  "SP_METADATA_PATH is not defined"
);
export const UPVS_ENV = assertIsDefined(
  process.env.UPVS_ENV,
  "UPVS_ENV is not defined"
);
export const UPVS_SSO_SP_SIGNING_PRIVATE_KEY = assertIsDefined(
  process.env.UPVS_SSO_SP_SIGNING_PRIVATE_KEY,
  "UPVS_SSO_SP_SIGNING_PRIVATE_KEY is not defined"
);
export const UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY = assertIsDefined(
  process.env.UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY,
  "UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY is not defined"
);

export const PATH_SP_METADATA = path.resolve(SP_METADATA_PATH);
export const PATH_IDP_METADATA = path.resolve(
  `../security/upvs_${UPVS_ENV}.metadata.xml`
);

function readXml(fp: string) {
  const parser = new XMLParser({
    attributeNamePrefix: "@_",
    parseAttributeValue: true,
    ignoreAttributes: false,
  });
  const f = fs.readFileSync(fp, "utf8");
  f.replace(/[\n\r\t]/g, "");
  let result = parser.parse(f);

  return result;
}

const sp_xml = readXml(PATH_SP_METADATA);
export const sp_metadata = {
  entity_id: sp_xml["EntityDescriptor"]["@_entityID"],
  assertion_consumer_service_url:
    sp_xml["EntityDescriptor"]["SPSSODescriptor"][
      "AssertionConsumerService"
    ][0]["@_Location"],

  single_logout_service_url:
    sp_xml["EntityDescriptor"]["SPSSODescriptor"]["SingleLogoutService"][0][
      "@_Location"
    ],
  sigining_cert: cleanCert(
    sp_xml["EntityDescriptor"]["SPSSODescriptor"]["KeyDescriptor"].find(
      (x: any) => x["@_use"] === "signing"
    )?.["KeyInfo"]["X509Data"]["X509Certificate"]
  ),
  signing_private_key: cleanCert(UPVS_SSO_SP_SIGNING_PRIVATE_KEY),
  encryption_cert: cleanCert(
    sp_xml["EntityDescriptor"]["SPSSODescriptor"]["KeyDescriptor"].find(
      (x: any) => x["@_use"] === "encryption"
    )?.["KeyInfo"]["X509Data"]["X509Certificate"]
  ),
  encryption_private_key: cleanCert(UPVS_SSO_SP_ENCRYPTION_PRIVATE_KEY),
};

const idp_xml = readXml(PATH_IDP_METADATA);
export const idp_metadata = {
  entity_id: idp_xml["md:EntityDescriptor"]["@_entityID"],
  single_sign_on_service_url:
    idp_xml["md:EntityDescriptor"]["md:IDPSSODescriptor"][
      "md:SingleSignOnService"
    ][0]["@_Location"],
  single_logout_service_url:
    idp_xml["md:EntityDescriptor"]["md:IDPSSODescriptor"][
      "md:SingleLogoutService"
    ][0]["@_Location"],
  x509_signing_cert: cleanCert(
    idp_xml["md:EntityDescriptor"]["md:IDPSSODescriptor"][
      "md:KeyDescriptor"
    ].find((key: any) => key["@_use"] === "signing")?.["dsig:KeyInfo"][
      "dsig:X509Data"
    ]["dsig:X509Certificate"]
  ),
  x509_encryption_cert: cleanCert(
    idp_xml["md:EntityDescriptor"]["md:IDPSSODescriptor"][
      "md:KeyDescriptor"
    ].find((key: any) => key["@_use"] === "encryption")?.["dsig:KeyInfo"][
      "dsig:X509Data"
    ]["dsig:X509Certificate"]
  ),
};

/**
 * Helper function to remove whitespace and header/footer from a certificate
 */
function cleanCert(cert: string) {
  return cert
    .replace(/[\n\r\t ]/g, "")
    .replace(/-----BEGIN CERTIFICATE-----/, "")
    .replace(/-----END CERTIFICATE-----/, "");
}

/**
 * Helper function to assert that a value is defined
 */
function assertIsDefined<T>(val: T, failureMessage?: string): NonNullable<T> {
  if (val === undefined || val === null) {
    if (failureMessage) {
      console.log({ val });
      throw new Error(failureMessage);
    }
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
  return val;
}
