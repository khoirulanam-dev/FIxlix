import * as dotenv from "dotenv";
dotenv.config();

import { db, pool } from "./index";
import * as schema from "./schema";
import { hashPassword } from "better-auth/crypto";

async function seedAccounts() {
  console.log("🔐 Seeding password accounts for users...");
  const defaultPassword = "Fixlix123!";
  const adminPassword = "AdminFixlix123!";

  const allUsers = await db.select().from(schema.users);

  for (const u of allUsers) {
    const pwd = u.role === "ADMIN" ? adminPassword : defaultPassword;
    const hashedPassword = await hashPassword(pwd);

    await db
      .insert(schema.accounts)
      .values({
        id: `acc-${u.id}`,
        userId: u.id,
        accountId: u.id,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.accounts.id,
        set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
  }

  console.log("✅ User accounts successfully seeded with secure passwords!");
}

seedAccounts()
  .catch(console.error)
  .finally(() => pool.end());

