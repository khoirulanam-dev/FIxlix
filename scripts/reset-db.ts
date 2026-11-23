import * as dotenv from "dotenv";
dotenv.config();

import { db, pool } from "../src/lib/db";
import * as schema from "../src/lib/db/schema";
import { eq, ne, sql } from "drizzle-orm";

async function resetDb() {
  console.log("🧹 Memulai reset database Fixlix...");

  // 1. Pastikan akun Admin ada
  const adminUsers = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.role, "ADMIN"));

  let adminId = "usr-admin-01";
  if (adminUsers.length === 0) {
    console.log("Admin tidak ditemukan, membuat akun admin baru...");
    await db.insert(schema.users).values({
      id: adminId,
      name: "Admin Fixlix",
      email: "admin@fixlix.co.id",
      emailVerified: true,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
      phone: "08110000001",
      role: "ADMIN",
      status: "ACTIVE",
    });

    await db.insert(schema.accounts).values({
      id: "acc-usr-admin-01",
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
      password: "0d0ae0dc52783b6c389689b42fff9bca:ecd191c5dbb91154e15bca55bcef825a3f0d8e4b6f29a54149febd4a2c9c125f71a526a9e8e59400e4173c139fec237beccb0a4eb0aab9e5e6acd9ab5ee1ef93", // AdminFixlix123!
    });
  } else {
    adminId = adminUsers[0].id;
    console.log(`Admin ditemukan: ${adminUsers[0].email} (${adminId})`);
  }

  // 2. Bersihkan seluruh log dan data relasi transaksi
  console.log("Menghapus seluruh audit log...");
  await db.delete(schema.auditLogs);

  console.log("Menghapus seluruh riwayat komisi...");
  await db.delete(schema.commissionRateHistory);

  console.log("Menghapus notifikasi...");
  await db.delete(schema.notifications);

  console.log("Menghapus ulasan/reviews...");
  await db.delete(schema.reviews);

  console.log("Menghapus data pembayaran...");
  await db.delete(schema.payments);

  console.log("Menghapus lampiran & riwayat status order...");
  await db.delete(schema.orderAttachments);
  await db.delete(schema.orderStatusHistory);
  await db.delete(schema.orderSpareparts);
  await db.delete(schema.orderAdditionalCharges);

  console.log("Menghapus seluruh order...");
  await db.delete(schema.orders);

  console.log("Menghapus data portofolio & layanan teknisi...");
  await db.delete(schema.portfolioItems);
  await db.delete(schema.technicianServices);

  console.log("Menghapus seluruh profil teknisi...");
  await db.delete(schema.technicianProfiles);

  console.log("Menghapus token verifikasi...");
  await db.delete(schema.verifications);

  console.log("Menghapus sesi login...");
  await db.delete(schema.sessions);

  console.log("Menghapus akun kredensial selain admin...");
  await db.delete(schema.accounts).where(ne(schema.accounts.userId, adminId));

  console.log("Menghapus pengguna selain admin (customer & teknisi)...");
  await db.delete(schema.users).where(ne(schema.users.role, "ADMIN"));

  // 3. Verifikasi kondisi akhir
  const countUsers = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
  const countTechnicians = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.users)
    .where(eq(schema.users.role, "TECHNICIAN"));
  const countCustomers = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.users)
    .where(eq(schema.users.role, "CUSTOMER"));
  const countOrders = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);
  const countProfiles = await db.select({ count: sql<number>`count(*)` }).from(schema.technicianProfiles);
  const countServices = await db.select({ count: sql<number>`count(*)` }).from(schema.technicianServices);
  const countPayments = await db.select({ count: sql<number>`count(*)` }).from(schema.payments);
  const countReviews = await db.select({ count: sql<number>`count(*)` }).from(schema.reviews);
  const countLogs = await db.select({ count: sql<number>`count(*)` }).from(schema.auditLogs);
  const countCategories = await db.select({ count: sql<number>`count(*)` }).from(schema.categories);

  console.log("\n=================================");
  console.log("📊 HASIL RESET DATABASE FIXLIX");
  console.log("=================================");
  console.log(`• Total Pengguna    : ${countUsers[0].count} (Hanya Admin)`);
  console.log(`• Akun Teknisi      : ${countTechnicians[0].count}`);
  console.log(`• Akun Customer     : ${countCustomers[0].count}`);
  console.log(`• Profil Teknisi    : ${countProfiles[0].count}`);
  console.log(`• Layanan Teknisi   : ${countServices[0].count}`);
  console.log(`• Total Order       : ${countOrders[0].count}`);
  console.log(`• Total Pembayaran  : ${countPayments[0].count}`);
  console.log(`• Total Review      : ${countReviews[0].count}`);
  console.log(`• Total Audit Log   : ${countLogs[0].count}`);
  console.log(`• Kategori Master   : ${countCategories[0].count} (Tetap utuh)`);
  console.log("=================================");
  console.log("✅ Database berhasil di-reset ke kondisi nol (hanya Admin tersisa)!");
}

resetDb()
  .catch((err) => {
    console.error("❌ Gagal reset database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

