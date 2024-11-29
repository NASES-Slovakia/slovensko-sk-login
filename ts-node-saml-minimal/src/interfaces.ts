import { z } from "zod";
/**
 * Zod schema for the SAML callback request body
 */
export const ZCallbackRequestBody = z
  .object({
    SAMLResponse: z.string(),
  })
  .catchall(z.string());

/**
 * Zod schema for the SAML logout query
 */
export const ZLogoutQuery = z
  .object({
    SAMLRequest: z.string().optional(),
    SAMLResponse: z.string().optional(),
  })
  .catchall(z.string());

/**
 * Interface for the SAML profile - mirrored from @node-saml/node-saml
 */
interface Profile {
  issuer: string;
  nameID: string;
  nameIDFormat: string;
  [key: string]: unknown;
}

// Extend the Fastify session to include SAML data
declare module "fastify" {
  interface Session {
    saml: { profile: Profile | null; loggedOut?: boolean };
  }
}
