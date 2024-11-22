// import { samlifyGetLoginUrl } from "./samlify";
// samlifyGetLoginUrl();

import { getIdpLoginUrl } from "../saml/node-saml.js";
// import { getLoginUrl } from "./saml2js";

const url = await getIdpLoginUrl();
console.log("Login URL:", url);

fetch(url, {
  redirect: "manual",
})
  .then(async (res) => {
    if (
      res.status === 302 &&
      res.headers.get("location") ===
        "https://prihlasenie.upvsfix.gov.sk/oam/pages/servererror.jsp"
    ) {
      console.error("\nFailed to login");
    } else {
      console.log("Response status:", res.status);
      console.log("Response headers:", [...res.headers.values()]);
      console.log("Response body:", await res.text());
    }
  })
  .catch((err) => {
    console.error("Error:", err);
  });
