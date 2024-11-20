import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fs from "fs";
import path from "path";
import { __dirname } from "./utils";
import { getLoginForm, getLoginUrl, validateLoginResponse } from "./saml2js";

// import { saml, getLoginUrl, getLoginForm } from "./node-saml";

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, "../localhost.dev-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../localhost.dev.pem")),
  },
});

fastify.register(fastifyFormbody);

// Declare a route
fastify.get("/", async function handler(request, reply) {
  reply.type("text/html");
  const form = await getLoginForm();
  return `
    <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <h1>Test</h1>
            <ul>
            <li><a href="${await getLoginUrl()}">Login</a></li>
            <li><a href="/login">Login using POST Form</a></li>
            <form id="saml-form" method="post" action="${
              form.entityEndpoint
            }" autocomplete="off">
                <input type="hidden" name="SAMLRequest" value="${
                  form.context
                }" />
                <input type="submit" value="Login" />
            </form>
            <li><a href="/logout">Logout</a></li>
            </ul>
        </body>
    `;
});

fastify.get("/login", async function handler(request, reply) {
  // reply.type("text/html");
  // return getLoginForm();

  // redirect to idp
  return reply.redirect(await getLoginUrl());
});

// fastify.get("/logout", async function handler(request, reply) {
//   return reply.redirect(await getLogoutUrl());
// });

fastify.get("/upvs/logout", async function handler(request, reply) {
  return "?";
});

fastify.get("/auth/saml/logout", async function handler(request, reply) {
  return "?";
});

fastify.post("/auth/saml/callback", async function handler(request, reply) {
  console.log("SAML callback", request.query);
  console.log("SAML callback body", request.body);

  const res = await validateLoginResponse(request.body as any);
  reply.type("text/html");
  return `
    <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <h1>Response</h1>
            <code>
            ${res}
            </code>
            <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/logout">Logout</a></li>
            </ul>
        </body>
    `;
});

// Run the server!
try {
  console.log("Starting server on \n\n https://localhost.dev:3001\n\n");
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
