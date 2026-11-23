import * as dotenv from "dotenv";
dotenv.config();

import { db, pool } from "../src/lib/db";
import * as schema from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

async function cleanOrdersAndLogs() {
  console.log("🧹 Membersihkan seluruh riwayat pesanan, transaksi, dan audit log...");

  // Hapus seluruh data transaksi, pembayaran, riwayat status, lampiran, dan review
  await db.delete(schema.auditLogs);
  await db.delete(schema.notifications);
  await db.delete(schema.commissionRateHistory);
  await db.delete(schema.reviews);
  await db.delete(schema.payments);
  await db.delete(schema.orderAttachments);
  await db.delete(schema.orderStatusHistory);
  await db.delete(schema.orderSpareparts);
  await db.delete(schema.orderAdditionalCharges);
  await db.delete(schema.orders);

  // Reset rating & review count pada profil teknisi ke 0
  await db.update(schema.technicianProfiles).set({
    averageRating: "0.00",
    reviewCount: 0,
    updatedAt: new Date(),
  });

  const ordersCount = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);
  const paymentsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.payments);
  const reviewsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.reviews);
  const auditLogsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.auditLogs);
  const usersCount = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
  const techProfilesCount = await db.select({ count: sql<number>`count(*)` }).from(schema.technicianProfiles);
  const servicesCount = await db.select({ count: sql<number>`count(*)` }).from(schema.technicianServices);

  console.log("\n=================================");
  console.log("📊 STATUS DATA SETELAH PEMBERSIHAN LOG");
  console.log("=================================");
  console.log(`• Total Pesanan (Orders)    : ${ordersCount[0].count} (KOSONG TOTAL)`);
  console.log(`• Total Transaksi Pembayaran: ${paymentsCount[0].count} (KOSONG TOTAL)`);
  console.log(`• Total Ulasan (Reviews)    : ${reviewsCount[0].count} (KOSONG TOTAL)`);
  console.log(`• Total Audit Log           : ${auditLogsCount[0].count} (KOSONG TOTAL)`);
  console.log(`• Pengguna (Admin, Cust, Tech): ${usersCount[0].count} (Akun tetap ada)`);
  console.log(`• Profil Teknisi            : ${techProfilesCount[0].count} (Tetap utuh)`);
  console.log(`• Layanan Teknisi           : ${servicesCount[0].count} (Tetap utuh)`);
  console.log("=================================");
  console.log("✅ Seluruh riwayat transaksi & log berhasil dibersihkan total!");
}

cleanOrdersAndLogs()
  .catch((err) => {
    console.error("❌ Gagal membersihkan log:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

