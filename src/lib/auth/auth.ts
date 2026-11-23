import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: async (request) => {
    const envOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((s) => s.trim())
      : [];

    const originHeader = request?.headers?.get("origin");
    const refererHeader = request?.headers?.get("referer");
    let detectedOrigin: string | null = null;

    if (originHeader) {
      try {
        detectedOrigin = new URL(originHeader).origin;
      } catch {}
    } else if (refererHeader) {
      try {
        detectedOrigin = new URL(refererHeader).origin;
      } catch {}
    }

    return [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:*",
      "http://127.0.0.1:*",
      "http://10.20.110.242:3000",
      "http://10.*",
      "https://10.*",
      "http://192.168.*",
      "https://192.168.*",
      "http://172.*",
      "https://172.*",
      ...(detectedOrigin ? [detectedOrigin] : []),
      ...envOrigins,
    ];
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

