import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://f-ixlix.vercel.app"),
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

    const allowed = new Set<string>([
      "https://f-ixlix.vercel.app",
      ...envOrigins,
    ]);

    if (process.env.BETTER_AUTH_URL) {
      try {
        allowed.add(new URL(process.env.BETTER_AUTH_URL).origin);
      } catch {}
    }

    if (process.env.NEXT_PUBLIC_APP_URL) {
      try {
        allowed.add(new URL(process.env.NEXT_PUBLIC_APP_URL).origin);
      } catch {}
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      allowed.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    if (process.env.VERCEL_URL) {
      allowed.add(`https://${process.env.VERCEL_URL}`);
    }

    // Allow *.vercel.app for preview deployments
    allowed.add("https://*.vercel.app");

    // Only allow localhost during local development
    if (process.env.NODE_ENV !== "production") {
      allowed.add("http://localhost:3000");
      allowed.add("http://127.0.0.1:3000");
    }

    return Array.from(allowed);
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if ((user as any).role === "TECHNICIAN") {
            try {
              const cleanWa = ((user as any).phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62");
              const baseSlug = (user.name || "teknisi").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              const slug = `${baseSlug || "teknisi"}-${user.id.slice(-6)}`;
              await db
                .insert(schema.technicianProfiles)
                .values({
                  userId: user.id,
                  slug,
                  displayName: user.name,
                  whatsappPhone: cleanWa || "628000000000",
                  bio: "Teknisi mitra Fixlix profesional siap melayani perbaikan peralatan elektronik dengan diagnosa jujur & transparan.",
                  serviceAreaText: "Jabodetabek",
                  verificationStatus: "VERIFIED",
                })
                .onConflictDoNothing();
            } catch (err) {
              console.error("Auto-provision technician profile error:", err);
            }
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

