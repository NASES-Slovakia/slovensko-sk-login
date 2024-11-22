import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import { fastifySession } from "@fastify/session";
import { fastifyCookie } from "@fastify/cookie";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";
import { __dirname } from "./utils.js";
// import {
//   getLoginForm,
//   getLoginUrl,
//   getLogoutUrl,
//   validateLoginResponse,
//   validateLogoutResponse,
// } from "./saml2js";

import {
  getLoginForm,
  getIdpLoginUrl,
  getIdpLogoutUrl,
  validatePostResponse,
  validateRedirectResponse,
  getLogoutReplyUrl,
} from "./node-saml.js";

interface Profile {
  issuer: string;
  nameID: string;
  nameIDFormat: string;
  [key: string]: unknown;
}

declare module "fastify" {
  interface Session {
    saml: { profile: Profile | null; loggedOut?: boolean };
  }
}

const ZCallbackRequestBody = z.object({
  SAMLResponse: z.string(),
});

const ZLogoutQuery = z.object({
  SAMLRequest: z.string().optional(),
  SAMLResponse: z.string().optional(),
});

// import { saml, getLoginUrl, getLoginForm } from "./node-saml";

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, "../localhost.dev-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../localhost.dev.pem")),
  },
});

fastify.register(fastifyFormbody);
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "set 32 char secret",
});
fastify.register(fastifySession, {
  secret: process.env.SESSION_SECRET || "set 32 char secret",
});

// Declare a route
fastify.get("/", async function handler(request: any, reply: any) {
  reply.type("text/html");
  return `
    <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <h1>Test</h1>
            ${
              !request.session?.saml?.profile ||
              request.session?.saml?.loggedOut
                ? `<a href="${await getIdpLoginUrl()}">Login</a>`
                : `<a href="${await getIdpLogoutUrl({
                    profile: request.session.saml.profile,
                  })}">Logout</a>`
            }
            </ul>
            <h2>Session</h2>
            <pre>
            ${JSON.stringify(request.session.saml, null, 3)}
            </pre>
        </body>
    `;
});

// fastify.get("/login", async function handler(request, reply) {
//   // reply.type("text/html");
//   // return getLoginForm();

//   // redirect to idp
//   return reply.redirect(await getLoginUrl());
// });

const getQueryFromUrl = (url: string) => {
  const u = new URL(url, "https://localhost.dev");
  return u.search.substring(1); // remove leading `?`
};

fastify.get("/upvs/logout", async function handler(request: any, reply: any) {
  console.log("UPVS logout", request);
  console.log("UPVS logout query", request.query);

  // Validate if query comes in the correct format
  const requestQuery = ZLogoutQuery.parse(request.query);

  console.log(requestQuery);

  // Check if query is valid
  const result = await validateRedirectResponse(
    requestQuery,
    getQueryFromUrl(request.url)
  );

  // Save query data to session
  request.session.saml = result;

  if (requestQuery.SAMLResponse && requestQuery.SAMLRequest) {
    throw new Error("Both SAMLResponse and SAMLRequest are present");
  }

  if (requestQuery.SAMLResponse) {
    reply.redirect("/");
    return result;
  }

  if (requestQuery.SAMLRequest && result.profile && result.loggedOut) {
    reply.redirect(await getLogoutReplyUrl(result.profile, true));
    return result;
  }

  return result;
});

fastify.get(
  "/auth/saml/logout",
  async function handler(request: any, reply: any) {
    // Validate if query comes in the correct format
    const requestQuery = ZLogoutQuery.parse(request.query);

    console.log(requestQuery);

    // Check if query is valid
    const result = await validateRedirectResponse(
      requestQuery,
      getQueryFromUrl(request.url)
    );

    // Save query data to session
    request.session.saml = result;

    if (requestQuery.SAMLResponse && requestQuery.SAMLRequest) {
      throw new Error("Both SAMLResponse and SAMLRequest are present");
    }

    if (requestQuery.SAMLResponse) {
      reply.redirect("/");
      return result;
    }

    if (requestQuery.SAMLRequest && result.profile && result.loggedOut) {
      reply.redirect(await getLogoutReplyUrl(result.profile, true));
      return result;
    }

    return result;
  }
);

fastify.post(
  "/auth/saml/callback",
  async function handler(request: any, reply: any) {
    console.log("SAML callback", request.query);
    console.log("SAML callback body", request.body);

    const requestBody = ZCallbackRequestBody.parse(request.body); // validate request body

    const result = await validatePostResponse(requestBody);
    request.session.saml = result;

    // redirect instead of returning the result ?
    reply.redirect("/");
    return;
  }
);

// Run the server!
try {
  console.log("Starting server on \n\n https://localhost.dev:3001\n\n");
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
