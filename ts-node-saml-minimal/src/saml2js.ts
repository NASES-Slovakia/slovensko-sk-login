import saml2js from "saml2-js";
import { idp_metadata, sp_metadata } from "./metadata.js";
import { awaitable, pemWrap, printSamlRequestUrl } from "./utils.js";
import zlib from "zlib";

const idp = new saml2js.IdentityProvider({
  sso_login_url: idp_metadata.single_sign_on_service_url,
  sso_logout_url: idp_metadata.single_logout_service_url,
  certificates: [
    pemWrap("CERTIFICATE", idp_metadata.x509_signing_cert),
    pemWrap("CERTIFICATE", idp_metadata.x509_encryption_cert),
  ],
  allow_unencrypted_assertion: true,
  force_authn: false,
  sign_get_request: true,
});

const sep = new saml2js.ServiceProvider({
  entity_id: sp_metadata.entity_id,
  private_key: pemWrap("PRIVATE KEY", sp_metadata.signing_private_key),
  certificate: pemWrap("CERTIFICATE", sp_metadata.sigining_cert),
  assert_endpoint: sp_metadata.assertion_consumer_service_url,
  allow_unencrypted_assertion: true,
  nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  force_authn: false,
  sign_get_request: true,
  notbefore_skew: 30,
});

console.log({ idp, sep });
// console.log(sep.create_metadata());

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
export async function getLoginUrl(): Promise<string> {
  // const [login_url, request_id] = (await awaitable(
  //   create_login_request_url_bound
  // )()) as unknown as [string, string];

  return new Promise((resolve, reject) => {
    sep.create_login_request_url(idp, {}, (err, login_url, request_id) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      console.log(login_url);
      printSamlRequestUrl(login_url);
      resolve(login_url);
    });
  });
}

export async function getLogoutUrl(name_id: string): Promise<string> {
  console.log("logout", { name_id });
  return new Promise((resolve, reject) => {
    sep.create_logout_request_url(
      idp,
      {
        name_id,
        sign_get_request: true,
        allow_unencrypted_assertion: true,
      },
      (err, logout_url, request_id) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log({ logout_url });
        printSamlRequestUrl(logout_url);
        resolve(logout_url);
      }
    );
  });
}

export async function validatePostResponse(request_body: {
  SAMLResponse?: string;
  SAMLRequest?: string;
}): Promise<object> {
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

          return reject(JSON.stringify(err, null, 2));
        }
        console.log({ resp });
        resolve(resp.user);
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

export async function validateRedirectResponse(
  query: Record<string, string>,
  originalQuery: string
) {
  return new Promise((resolve, reject) => {
    sep.redirect_assert(
      idp,
      {
        request_body: query,
        allow_unencrypted_assertion: true,
      },
      (err, resp) => {
        console.log("redirect_assert");
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log({ resp });
        resolve(resp.user);
      }
    );
  });
}

// validateLoginResponse().then(() => {
//   console.log("done");
// });

// getLoginUrl().then(() => {
//   console.log("done");
// });

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

// console.log("create_authn_request_xml1");
// const xml = sep.create_authn_request_xml(idp, {});
// console.log(xml);
// const url = new URL(idp_metadata.single_sign_on_service_url);
// url.searchParams.set("SAMLRequest", Buffer.from(xml).toString("base64"));
// console.log(url.toString());

export function getLoginForm() {
  console.log("create_authn_request_xml1");
  const xml = sep.create_authn_request_xml(idp, {});
  console.log(xml);
  const url = new URL(idp_metadata.single_sign_on_service_url);
  url.searchParams.set("SAMLRequest", Buffer.from(xml).toString("base64"));
  console.log(url.toString());
  const form = {
    entityEndpoint: idp_metadata.single_sign_on_service_url,
    context: Buffer.from(zlib.deflateRawSync(xml)).toString("base64"),
  };

  return `<form id="saml-form" method="post" action="${form.entityEndpoint}" autocomplete="off">
                <input type="hidden" name="SAMLRequest" value="${form.context}" />
                <input type="submit" value="Login" />
            </form>`;
}

declare module "saml2-js" {
  interface ServiceProvider {
    create_authn_request_xml(idp: IdentityProvider, options: any): string;
  }
}
