import saml2js from "saml2-js";
import { idp_metadata, sp_metadata } from "./metadata";
import { awaitable } from "./utils";
import zlib from "zlib";

const idp = new saml2js.IdentityProvider({
  sso_login_url: idp_metadata.single_sign_on_service_url,
  sso_logout_url: idp_metadata.single_logout_service_url,
  certificates: [
    idp_metadata.x509_signing_cert,
    idp_metadata.x509_encryption_cert,
  ],
  allow_unencrypted_assertion: false,
  force_authn: false,
  sign_get_request: false,
});

const sep = new saml2js.ServiceProvider({
  entity_id: sp_metadata.entity_id,
  private_key: sp_metadata.signing_private_key,
  certificate: sp_metadata.sigining_cert,
  assert_endpoint: sp_metadata.assertion_consumer_service_url,
  allow_unencrypted_assertion: false,
  nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  force_authn: false,
  sign_get_request: false,
  audience: idp_metadata.entity_id,
});

console.log({ idp, sep });
// console.log(sep.create_metadata());

function create_login_request_url_bound(fn) {
  return sep.create_login_request_url(idp, {}, fn);
}

function create_logout_request_url_bound(fn) {
  return sep.create_logout_request_url(idp, {}, fn);
}

// fun((err, login_url, request_id) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(login_url);
// });

// sep.create_login_request_url(idp, {}, (err, login_url, request_id) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(login_url);
// });
///////

/**
 *
 * @returns [login_url, request_id]
 */
export async function getLoginUrl() {
  const [login_url, request_id] = (await awaitable(
    create_login_request_url_bound
  )()) as unknown as [string, string];

  const url = new URL(login_url);
  const samlRequest = url.searchParams.get("SAMLRequest");
  console.log({
    login_url,
    request_id,
    samlRequest,
  });

  if (!samlRequest) {
    throw new Error("SAMLRequest not found in login_url");
  }
  zlib.inflateRaw(Buffer.from(samlRequest, "base64"), (err, buffer) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(buffer.toString("utf-8"));
  });

  return login_url;
}

export async function getLogoutUrl() {
  const [logout_url, request_id] = (await awaitable(
    create_logout_request_url_bound
  )()) as unknown as [string, string];

  console.log({ logout_url, request_id });

  return logout_url;
}

export async function validateLoginResponse(request_body: {
  SAMLResponse: string;
  SAMLRequest: string;
}) {
  //   const resp = await awaitable(sep.redirect_assert)(idp, {});
  //   console.log({ resp });

  console.dir(request_body, {
    depth: null,
  });

  return new Promise((resolve, reject) => {
    sep.post_assert(
      idp,
      { request_body, allow_unencrypted_assertion: true },
      (err, resp) => {
        console.log("post_assert");
        if (err) {
          console.dir(err, { depth: null });

          return resolve(JSON.stringify(err, null, 2));
        }
        console.log({ resp });
        resolve(JSON.stringify(resp.user, null, 2));
      }
    );
  });

  //   sep.redirect_assert(
  //     idp,
  //     {
  //       request_body,
  //       allow_unencrypted_assertion: true,
  //     },
  //     (err, resp) => {
  //       console.log("redirect_assert");
  //       if (err) {
  //         console.error(err);
  //         return;
  //       }
  //       console.log({ resp });
  //     }
  //   );
}

// validateLoginResponse().then(() => {
//   console.log("done");
// });

getLoginUrl().then(() => {
  console.log("done");
});

// logout url

// sep.create_logout_request_url(idp, {}, (err, logout_url, request_id) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(logout_url);
// });

// login url
// sep.create_login_request_url(idp, {}, (err, login_url, request_id) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(login_url);
// });
