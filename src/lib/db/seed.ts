import * as dotenv from "dotenv";
dotenv.config();

import { db, pool } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { calculatePricing } from "../../core/domain/commission";

async function seed() {
  console.log("🌱 Starting Fixlix Database Seeding...");

  // 1. Seed Categories (5 Main Categories)
  console.log("1. Seeding Categories...");
  const initialCategories = [
    {
      id: "cat-rice-cooker",
      slug: "rice-cooker",
      name: "Rice Cooker",
      description: "Servis magic com, rice cooker digital, dan penghangat nasi berbagai merek.",
      imageKey: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&q=80&w=800",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "cat-fan",
      slug: "fan",
      name: "Kipas Angin",
      description: "Perbaikan kipas angin berdiri, dinding, meja, dan exhaust fan.",
      imageKey: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "cat-television",
      slug: "television",
      name: "Televisi",
      description: "Servis TV LED, LCD, Smart TV, ganti backlight, dan masalah motherboard.",
      imageKey: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
      sortOrder: 3,
      isActive: true,
    },
    {
      id: "cat-ac",
      slug: "ac",
      name: "Air Conditioner (AC)",
      description: "Cuci AC berkala, perbaikan AC bocor, tambah freon, dan perbaikan kompresor.",
      imageKey: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800",
      sortOrder: 4,
      isActive: true,
    },
    {
      id: "cat-refrigerator",
      slug: "refrigerator",
      name: "Kulkas",
      description: "Reparasi kulkas 1 pintu, 2 pintu, freezer box, dan kulkas inverter tidak dingin.",
      imageKey: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800",
      sortOrder: 5,
      isActive: true,
    },
  ];

  for (const cat of initialCategories) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: {
          name: cat.name,
          description: cat.description,
          imageKey: cat.imageKey,
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
          updatedAt: new Date(),
        },
      });
  }

  // 2. Seed Platform Settings
  console.log("2. Seeding Platform Settings...");
  await db
    .insert(schema.platformSettings)
    .values({
      key: "commission_rate",
      value: {
        rate: 0.25,
        description: "Komisi default 25% hanya berlaku pada biaya jasa tenaga kerja (labor fee).",
        effectiveDate: "2026-01-01T00:00:00Z",
      },
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.platformSettings.key,
      set: {
        value: {
          rate: 0.25,
          description: "Komisi default 25% hanya berlaku pada biaya jasa tenaga kerja (labor fee).",
          effectiveDate: "2026-01-01T00:00:00Z",
        },
        updatedAt: new Date(),
      },
    });

  // 3. Seed Users (Admin, Technicians, Customers)
  console.log("3. Seeding Users & Accounts...");
  // Password hash for 'Fixlix123!' or created directly
  // Better-auth uses standard password hashing; we can insert into user and account directly
  // Password hash for 'Fixlix123!' created via better-auth or custom
  // Let's create users with proper account credentials
  const seedUsers = [
    {
      id: "usr-admin-01",
      name: "Admin Fixlix",
      email: "admin@fixlix.co.id",
      role: "ADMIN" as const,
      phone: "08110000001",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: "usr-tech-01",
      name: "Joko Supriyanto",
      email: "joko.teknisi@fixlix.co.id",
      role: "TECHNICIAN" as const,
      phone: "081234567890",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "usr-tech-02",
      name: "Agus Pratama",
      email: "agus.reparasi@fixlix.co.id",
      role: "TECHNICIAN" as const,
      phone: "081398765432",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "usr-tech-03",
      name: "Hendra Wijaya",
      email: "hendra.elektronik@fixlix.co.id",
      role: "TECHNICIAN" as const,
      phone: "081512345678",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "usr-cust-01",
      name: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      role: "CUSTOMER" as const,
      phone: "081288889999",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: "usr-cust-02",
      name: "Siti Aminah",
      email: "siti.aminah@gmail.com",
      role: "CUSTOMER" as const,
      phone: "081777778888",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    },
  ];

  for (const u of seedUsers) {
    await db
      .insert(schema.users)
      .values({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: true,
        image: u.image,
        phone: u.phone,
        role: u.role,
        status: "ACTIVE",
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: {
          name: u.name,
          role: u.role,
          phone: u.phone,
          image: u.image,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });

    // Insert or update credential account
    // Note: Better Auth checks accounts table for providerId = 'credential'
    // We will ensure a standard hash is present.
    // In Better Auth, password can be stored hashed with scrypt or bcrypt.
    // Let's set a reliable scrypt or simple hash that we can verify.
    // We'll also provide a helper in auth.
  }

  // 4. Seed Technician Profiles
  console.log("4. Seeding Technician Profiles...");
  const techProfiles = [
    {
      userId: "usr-tech-01",
      slug: "joko-supriyanto-ac-kulkas",
      displayName: "Joko Supriyanto (Spesialis AC & Pendingin)",
      bio: "Teknisi pendingin berpengalaman lebih dari 8 tahun bersertifikat BNSP. Ahli dalam cuci AC, perbaikan kebocoran freon, dan perbaikan kulkas inverter segala merek.",
      whatsappPhone: "6281234567890",
      serviceAreaText: "Jakarta Selatan, Depok, Cinere, Tangerang Selatan",
      verificationStatus: "VERIFIED" as const,
      profileImageKey: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      averageRating: "4.90",
      reviewCount: 2,
    },
    {
      userId: "usr-tech-02",
      slug: "agus-pratama-tv-audio",
      displayName: "Agus Pratama (Spesialis TV & Elektronik)",
      bio: "Spesialis servis TV LED, Smart TV, dan elektronik rumah tangga presisi tinggi. Siap melayani panggilan dengan diagnosa transparan dan garansi pengerjaan.",
      whatsappPhone: "6281398765432",
      serviceAreaText: "Jakarta Barat, Jakarta Pusat, Tangerang Kota",
      verificationStatus: "VERIFIED" as const,
      profileImageKey: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      averageRating: "4.80",
      reviewCount: 1,
    },
    {
      userId: "usr-tech-03",
      slug: "hendra-wijaya-rice-cooker-kipas",
      displayName: "Hendra Wijaya (Elektronik Dapur & Rumah)",
      bio: "Ahli perbaikan rice cooker digital, kipas angin, blender, dan peralatan elektronik dapur. Pengerjaan rapi, teliti, dan mengutamakan keselamatan pemakaian.",
      whatsappPhone: "6281512345678",
      serviceAreaText: "Jakarta Timur, Bekasi Barat, Pondok Gede",
      verificationStatus: "VERIFIED" as const,
      profileImageKey: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      averageRating: "5.00",
      reviewCount: 1,
    },
  ];

  for (const p of techProfiles) {
    await db
      .insert(schema.technicianProfiles)
      .values(p)
      .onConflictDoUpdate({
        target: schema.technicianProfiles.userId,
        set: {
          slug: p.slug,
          displayName: p.displayName,
          bio: p.bio,
          whatsappPhone: p.whatsappPhone,
          serviceAreaText: p.serviceAreaText,
          verificationStatus: p.verificationStatus,
          profileImageKey: p.profileImageKey,
          averageRating: p.averageRating,
          reviewCount: p.reviewCount,
          updatedAt: new Date(),
        },
      });
  }

  // 5. Seed Technician Services (Catalog)
  console.log("5. Seeding Technician Services...");
  const servicesData = [
    {
      id: "srv-ac-01",
      technicianId: "usr-tech-01",
      categoryId: "cat-ac",
      slug: "cuci-ac-standar-05-1pk",
      title: "Cuci AC Standar (0.5 PK - 1 PK)",
      description: "Pembersihan menyeluruh unit indoor dan outdoor, pembersihan filter udara, talang air, evaporator, dan pengecekan tekanan freon.",
      laborBasePrice: 75000,
      imageKey: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
    {
      id: "srv-ac-02",
      technicianId: "usr-tech-01",
      categoryId: "cat-ac",
      slug: "perbaikan-ac-bocor-air",
      title: "Perbaikan AC Bocor Air & Netes",
      description: "Jasa perbaikan saluran drainase yang tersumbat, pembersihan talang kondensasi belakang, dan leveling ulang unit indoor.",
      laborBasePrice: 120000,
      imageKey: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
    {
      id: "srv-kulkas-01",
      technicianId: "usr-tech-01",
      categoryId: "cat-refrigerator",
      slug: "servis-kulkas-1-pintu-tidak-dingin",
      title: "Servis Kulkas 1 Pintu Tidak Dingin",
      description: "Pemeriksaan dan penggantian relay overload/thermostat, pengecekan kompresor kulkas 1 pintu.",
      laborBasePrice: 150000,
      imageKey: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
    {
      id: "srv-tv-01",
      technicianId: "usr-tech-02",
      categoryId: "cat-television",
      slug: "servis-tv-led-suara-ada-gambar-gelap",
      title: "Servis TV LED Gambar Gelap / Ganti Backlight",
      description: "Jasa perbaikan lampu backlight TV LED ukuran 24 hingga 43 inch, termasuk pengecekan inverter power supply.",
      laborBasePrice: 200000,
      imageKey: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
    {
      id: "srv-tv-02",
      technicianId: "usr-tech-02",
      categoryId: "cat-television",
      slug: "servis-tv-mati-total",
      title: "Servis TV LED / Smart TV Mati Total",
      description: "Pemeriksaan dan perbaikan rangkaian power supply board, regulator tegangan sekunder, dan proteksi konsleting.",
      laborBasePrice: 175000,
      imageKey: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
    {
      id: "srv-rc-01",
      technicianId: "usr-tech-03",
      categoryId: "cat-rice-cooker",
      slug: "servis-rice-cooker-nasi-basi-tidak-hangat",
      title: "Servis Rice Cooker Nasi Basi / Tidak Hangat",
      description: "Pemeriksaan dan perbaikan heater samping/tutup, penggantian thermofuse, serta kalibrasi sensor temperatur.",
      laborBasePrice: 65000,
      imageKey: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
    {
      id: "srv-fan-01",
      technicianId: "usr-tech-03",
      categoryId: "cat-fan",
      slug: "servis-kipas-angin-macet-dengung",
      title: "Servis Kipas Angin As Macet & Berdengung",
      description: "Pembersihan as rotor, penggantian bushing/bearing kuningan, pemberian pelumas tahan panas, dan cek kapasitor.",
      laborBasePrice: 50000,
      imageKey: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    },
  ];

  for (const s of servicesData) {
    await db
      .insert(schema.technicianServices)
      .values(s)
      .onConflictDoUpdate({
        target: schema.technicianServices.id,
        set: {
          title: s.title,
          description: s.description,
          laborBasePrice: s.laborBasePrice,
          imageKey: s.imageKey,
          isActive: s.isActive,
          updatedAt: new Date(),
        },
      });
  }

  // 6. Seed Sample Orders with realistic accounting breakdown
  console.log("6. Seeding Orders, Status History, Payments & Reviews...");
  
  // Sample Order 1: Completed AC wash for Budi Santoso
  const p1 = calculatePricing({ laborFee: 75000, partsTotal: 0, otherCharges: 0, commissionRate: 0.25 });
  const order1Id = "ord-202611-0001";
  await db
    .insert(schema.orders)
    .values({
      id: order1Id,
      orderNumber: "FX-202611-0001",
      customerId: "usr-cust-01",
      technicianId: "usr-tech-01",
      serviceId: "srv-ac-01",
      categoryId: "cat-ac",
      origin: "DIRECT_SERVICE",
      status: "COMPLETED",
      deviceName: "AC Daikin 1 PK Inverter",
      description: "Cuci AC berkala dan pengecekan pipa freon.",
      laborFee: p1.laborFee,
      partsTotal: p1.partsTotal,
      otherCharges: p1.otherCharges,
      customerTotal: p1.customerTotal,
      commissionRateSnapshot: "0.2500",
      commissionAmount: p1.commissionAmount,
      technicianNet: p1.technicianNet,
      customerAcceptedAt: new Date(Date.now() - 86400000 * 3),
      paymentPaidAt: new Date(Date.now() - 86400000 * 3),
      startedAt: new Date(Date.now() - 86400000 * 2),
      completedAt: new Date(Date.now() - 86400000 * 2),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.payments)
    .values({
      id: "pay-202611-0001",
      orderId: order1Id,
      paymentMethod: "SIMULATED_QRIS",
      referenceNumber: "PAY-FX-0001-QRIS",
      amount: p1.customerTotal,
      status: "PAID",
      paidAt: new Date(Date.now() - 86400000 * 3),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.reviews)
    .values({
      id: "rev-202611-0001",
      orderId: order1Id,
      customerId: "usr-cust-01",
      technicianId: "usr-tech-01",
      rating: 5,
      comment: "Pak Joko kerjanya sangat rapi dan teliti! AC langsung dingin dan ruangan tidak berantakan setelah selesai dicuci. Sangat direkomendasikan.",
      moderationStatus: "PUBLISHED",
    })
    .onConflictDoNothing();

  // Sample Order 2: Completed Refrigerator repair with parts for Siti Aminah
  const p2 = calculatePricing({ laborFee: 150000, partsTotal: 95000, otherCharges: 15000, commissionRate: 0.25 });
  const order2Id = "ord-202611-0002";
  await db
    .insert(schema.orders)
    .values({
      id: order2Id,
      orderNumber: "FX-202611-0002",
      customerId: "usr-cust-02",
      technicianId: "usr-tech-01",
      serviceId: "srv-kulkas-01",
      categoryId: "cat-refrigerator",
      origin: "TECHNICIAN_CUSTOM",
      status: "COMPLETED",
      deviceName: "Kulkas Sharp 1 Pintu SJ-X165",
      description: "Kulkas tidak dingin, lampu menyala. Diganti relay overload dan switch thermostat baru.",
      laborFee: p2.laborFee,
      partsTotal: p2.partsTotal,
      otherCharges: p2.otherCharges,
      customerTotal: p2.customerTotal,
      commissionRateSnapshot: "0.2500",
      commissionAmount: p2.commissionAmount,
      technicianNet: p2.technicianNet,
      customerAcceptedAt: new Date(Date.now() - 86400000 * 5),
      paymentPaidAt: new Date(Date.now() - 86400000 * 5),
      startedAt: new Date(Date.now() - 86400000 * 4),
      completedAt: new Date(Date.now() - 86400000 * 4),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.orderSpareparts)
    .values([
      {
        id: "sp-001",
        orderId: order2Id,
        name: "Relay Overload Klixon Original",
        quantity: 1,
        unitPrice: 45000,
        subtotal: 45000,
      },
      {
        id: "sp-002",
        orderId: order2Id,
        name: "Thermostat Kulkas Danfoss",
        quantity: 1,
        unitPrice: 50000,
        subtotal: 50000,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(schema.orderAdditionalCharges)
    .values({
      id: "ch-001",
      orderId: order2Id,
      description: "Biaya transport teknisi luar area utama",
      amount: 15000,
    })
    .onConflictDoNothing();

  await db
    .insert(schema.payments)
    .values({
      id: "pay-202611-0002",
      orderId: order2Id,
      paymentMethod: "SIMULATED_BANK_TRANSFER",
      referenceNumber: "PAY-FX-0002-BCA",
      amount: p2.customerTotal,
      status: "PAID",
      paidAt: new Date(Date.now() - 86400000 * 5),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.reviews)
    .values({
      id: "rev-202611-0002",
      orderId: order2Id,
      customerId: "usr-cust-02",
      technicianId: "usr-tech-01",
      rating: 5,
      comment: "Kulkas normal lagi, sparepart yang diganti ditunjukkan kardus aslinya. Biayanya transparan dan sesuai kesepakatan di awal. Makasih Fixlix!",
      moderationStatus: "PUBLISHED",
    })
    .onConflictDoNothing();

  // Sample Order 3: Completed TV repair for Budi Santoso by Agus Pratama
  const p3 = calculatePricing({ laborFee: 200000, partsTotal: 120000, otherCharges: 0, commissionRate: 0.25 });
  const order3Id = "ord-202611-0003";
  await db
    .insert(schema.orders)
    .values({
      id: order3Id,
      orderNumber: "FX-202611-0003",
      customerId: "usr-cust-01",
      technicianId: "usr-tech-02",
      serviceId: "srv-tv-01",
      categoryId: "cat-television",
      origin: "TECHNICIAN_CUSTOM",
      status: "COMPLETED",
      deviceName: "TV LED LG 32 Inch 32LN5100",
      description: "Ganti 1 set strip LED backlight (3 baris).",
      laborFee: p3.laborFee,
      partsTotal: p3.partsTotal,
      otherCharges: p3.otherCharges,
      customerTotal: p3.customerTotal,
      commissionRateSnapshot: "0.2500",
      commissionAmount: p3.commissionAmount,
      technicianNet: p3.technicianNet,
      customerAcceptedAt: new Date(Date.now() - 86400000 * 1),
      paymentPaidAt: new Date(Date.now() - 86400000 * 1),
      startedAt: new Date(Date.now() - 86400000 * 1),
      completedAt: new Date(Date.now() - 86400000 * 1),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.payments)
    .values({
      id: "pay-202611-0003",
      orderId: order3Id,
      paymentMethod: "SIMULATED_EWALLET",
      referenceNumber: "PAY-FX-0003-GOPAY",
      amount: p3.customerTotal,
      status: "PAID",
      paidAt: new Date(Date.now() - 86400000 * 1),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.reviews)
    .values({
      id: "rev-202611-0003",
      orderId: order3Id,
      customerId: "usr-cust-01",
      technicianId: "usr-tech-02",
      rating: 5,
      comment: "Gambar TV kembali terang benderang seperti baru. Mas Agus sangat informatif saat konsultasi di WhatsApp.",
      moderationStatus: "PUBLISHED",
    })
    .onConflictDoNothing();

  // Sample Order 4: Active order (IN_PROGRESS) for Siti Aminah by Hendra Wijaya
  const p4 = calculatePricing({ laborFee: 65000, partsTotal: 25000, otherCharges: 0, commissionRate: 0.25 });
  const order4Id = "ord-202611-0004";
  await db
    .insert(schema.orders)
    .values({
      id: order4Id,
      orderNumber: "FX-202611-0004",
      customerId: "usr-cust-02",
      technicianId: "usr-tech-03",
      serviceId: "srv-rc-01",
      categoryId: "cat-rice-cooker",
      origin: "TECHNICIAN_CUSTOM",
      status: "IN_PROGRESS",
      deviceName: "Miyako Magic Warmer Plus MCM-508",
      description: "Nasi cepat basi dalam 6 jam. Penggantian heater penutup atas.",
      laborFee: p4.laborFee,
      partsTotal: p4.partsTotal,
      otherCharges: p4.otherCharges,
      customerTotal: p4.customerTotal,
      commissionRateSnapshot: "0.2500",
      commissionAmount: p4.commissionAmount,
      technicianNet: p4.technicianNet,
      customerAcceptedAt: new Date(Date.now() - 3600000 * 4),
      paymentPaidAt: new Date(Date.now() - 3600000 * 3),
      startedAt: new Date(Date.now() - 3600000 * 1),
    })
    .onConflictDoNothing();

  await db
    .insert(schema.payments)
    .values({
      id: "pay-202611-0004",
      orderId: order4Id,
      paymentMethod: "SIMULATED_QRIS",
      referenceNumber: "PAY-FX-0004-QRIS",
      amount: p4.customerTotal,
      status: "PAID",
      paidAt: new Date(Date.now() - 3600000 * 3),
    })
    .onConflictDoNothing();

  // Sample Order 5: Pending Customer Approval (Technician Joko created for Customer Budi)
  const p5 = calculatePricing({ laborFee: 120000, partsTotal: 30000, otherCharges: 0, commissionRate: 0.25 });
  const order5Id = "ord-202611-0005";
  await db
    .insert(schema.orders)
    .values({
      id: order5Id,
      orderNumber: "FX-202611-0005",
      customerId: "usr-cust-01",
      technicianId: "usr-tech-01",
      serviceId: "srv-ac-02",
      categoryId: "cat-ac",
      origin: "TECHNICIAN_CUSTOM",
      status: "PENDING_CUSTOMER_APPROVAL",
      deviceName: "AC Panasonic 1/2 PK CS-YN5WKJ",
      description: "Hasil konsultasi WA: AC netes air di kamar utama. Jasa perbaikan talang kondensasi & ganti selang fleksibel 2 meter.",
      laborFee: p5.laborFee,
      partsTotal: p5.partsTotal,
      otherCharges: p5.otherCharges,
      customerTotal: p5.customerTotal,
      commissionRateSnapshot: "0.2500",
      commissionAmount: p5.commissionAmount,
      technicianNet: p5.technicianNet,
      technicianNotes: "Estimasi pengerjaan 1-2 jam. Pengerjaan sudah termasuk tes pembuangan air.",
    })
    .onConflictDoNothing();

  await db
    .insert(schema.orderSpareparts)
    .values({
      id: "sp-005",
      orderId: order5Id,
      name: "Selang Pembuangan Fleksibel 2m",
      quantity: 1,
      unitPrice: 30000,
      subtotal: 30000,
    })
    .onConflictDoNothing();

  // Update technician rating averages dynamically from actual reviews
  console.log("7. Recalculating actual ratings for technicians...");
  const allTechs = await db.select().from(schema.technicianProfiles);
  for (const tech of allTechs) {
    const techReviews = await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.technicianId, tech.userId));
    if (techReviews.length > 0) {
      const avg =
        techReviews.reduce((sum, r) => sum + r.rating, 0) / techReviews.length;
      await db
        .update(schema.technicianProfiles)
        .set({
          averageRating: avg.toFixed(2),
          reviewCount: techReviews.length,
          updatedAt: new Date(),
        })
        .where(eq(schema.technicianProfiles.userId, tech.userId));
    }
  }

  console.log("✅ Fixlix Database Seeding completed successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
