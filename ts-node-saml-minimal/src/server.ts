import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import { fastifySession } from "@fastify/session";
import { fastifyCookie } from "@fastify/cookie";
import * as fs from "fs";
import * as path from "path";

import { __dirname, getQueryFromUrl } from "./utils.js";

import {
  getIdpLoginUrl,
  getIdpLogoutUrl,
  validatePostResponse,
  validateRedirectResponse,
  getLogoutReplyUrl,
} from "./saml.js";
import { ZCallbackRequestBody, ZLogoutQuery } from "./interfaces.js";

const fastify = Fastify({
  logger: true,
  // Enable https
  https: {
    key: fs.readFileSync(
      path.join(__dirname, process.env.TLS_KEY_PATH || "../tls/localhost.key")
    ),
    cert: fs.readFileSync(
      path.join(__dirname, process.env.TLS_CERT_PATH || "../tls/localhost.crt")
    ),
  },
});

// Enable parsing form encoded body
fastify.register(fastifyFormbody);

// Enable session and cookie handling
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "set 32 char secret",
});
fastify.register(fastifySession, {
  secret: process.env.SESSION_SECRET || "set 32 char secret",
});

//---------------------------------------------------------------------
// Routes
//---------------------------------------------------------------------
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

fastify.get("/upvs/logout", async function handler(request: any, reply: any) {
  console.log("UPVS logout query", request.query);

  // Validate if query comes in the correct format
  const requestQuery = ZLogoutQuery.parse(request.query);

  // Check if query is valid
  const result = await validateRedirectResponse(
    requestQuery,
    getQueryFromUrl(request.url)
  );

  // Save query data to session
  // Usually on successful logout you would clear the session, but for this example we keep it
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
    console.log("SAML logout query", request.query);
    // Validate if query comes in the correct format
    const requestQuery = ZLogoutQuery.parse(request.query);

    // Check if query is valid
    const result = await validateRedirectResponse(
      requestQuery,
      getQueryFromUrl(request.url)
    );

    // Save query data to session
    // Usually on successful logout you would clear the session, but for this example we keep it
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
    console.log("SAML callback body", request.body);

    const requestBody = ZCallbackRequestBody.parse(request.body); // validate request body

    const result = await validatePostResponse(requestBody);
    request.session.saml = result;

    reply.redirect("/");
    return;
  }
);

//---------------------------------------------------------------------
// Run the server
//---------------------------------------------------------------------
try {
  console.log("Starting server on \n\n https://localhost.dev:3001/\n\n");
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
