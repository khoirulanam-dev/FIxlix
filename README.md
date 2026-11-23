# Fixlix — Marketplace Servis & Perbaikan Elektronik Rumah Tangga

Fixlix adalah aplikasi web marketplace modern yang menghubungkan pelanggan yang membutuhkan jasa perbaikan peralatan rumah tangga dengan teknisi ahli terverifikasi di Indonesia. 

Fixlix dirancang khusus untuk memfasilitasi transparansi harga servis, konsultasi teknis melalui WhatsApp, sistem persetujuan pesanan (order approval), checkout pembayaran digital simulasi, serta sistem perhitungan komisi dan pembagian hasil akuntansi manajemen yang akurat.

---

## 1. Kategori Layanan Utama

Fixlix mencakup 5 kategori peralatan elektronik rumah tangga utama:
1. **Rice Cooker / Magic Com** (Penghangat nasi, digital rice cooker, ganti elemen/thermofuse)
2. **Kipas Angin** (Kipas berdiri, dinding, meja, as macet, ganti bushing/kapasitor)
3. **Televisi** (TV LED, LCD, Smart TV, perbaikan backlight, power supply board)
4. **Air Conditioner (AC)** (Cuci AC berkala, perbaikan bocor air, isi/tambah freon, kelistrikan)
5. **Kulkas** (Kulkas 1 pintu, 2 pintu, freezer, penggantian thermostat/relay kompresor)

---

## 2. Fitur Utama Berdasarkan Peran

### Pelanggan (Customer)
- **Katalog & Pencarian**: Menemukan layanan dan teknisi terverifikasi berdasarkan kategori atau kata kunci.
- **Konsultasi WhatsApp**: Tombol konsultasi langsung mengarahkan ke WhatsApp teknisi dengan pesan pengantar terstruktur dan aman (tanpa internal chat).
- **Order Jasa Dasar**: Memesan langsung jasa pengerjaan teknisi pada harga dasar yang tertera di katalog.
- **Persetujuan Order Kustom**: Meninjau rincian biaya (biaya jasa, sparepart, dan biaya tambahan) yang diterbitkan teknisi, serta menyetujui atau menolak pesanan sebelum proses pengerjaan.
- **Simulasi Pembayaran Digital**: Checkout menggunakan QRIS instan, Transfer Bank (Virtual Account), atau E-Wallet dengan pencatatan nomor referensi unik.
- **Pelacakan Status Realtime**: Memantau tahapan pengerjaan dari persetujuan, pembayaran, pengerjaan, hingga selesai.
- **Ulasan & Rating Transparan**: Memberikan rating bintang 1–5 dan ulasan objektif untuk pesanan yang telah selesai.

### Teknisi (Technician)
- **Profil Profesional**: Menampilkan bio, sertifikasi, keahlian kategori, area jangkauan servis, nomor WhatsApp, serta ulasan pelanggan aktual.
- **Katalog Layanan**: Mengelola katalog pengerjaan dengan penentuan harga jasa dasar (katalog profil tidak menampilkan harga untuk mendorong konsultasi).
- **Custom Order Builder**: Menerbitkan rincian order resmi khusus pelanggan setelah kesepakatan WhatsApp.
- **Live Commission Preview**: Kalkulator preview realtime saat pembuatan order yang menghitung biaya jasa, komisi platform (25%), sparepart (100% hak teknisi), biaya tambahan, total tagihan pelanggan, dan estimasi pendapatan bersih teknisi.
- **Manajemen Status Servis**: Memperbarui status pesanan ke tahap pengerjaan (*In Progress*) dan menandai pekerjaan selesai (*Completed*).
- **Dashboard Akuntansi & Pendapatan**: Rekapitulasi omzet transaksi, potongan komisi platform, pendapatan bersih, dan ulasan pelanggan.

### Administrator (Admin)
- **Executive Accounting Dashboard**: Analisis menyeluruh mengenai Gross Merchandise Value (GMV), total biaya jasa tenaga kerja, total sparepart & operasional, total pendapatan komisi platform, dan total hak bersih teknisi.
- **Manajemen & Verifikasi Teknisi**: Memeriksa kelayakan dan mengubah status verifikasi teknisi (*Verified*, *Suspended*, *Pending*).
- **Pengaturan Komisi Platform**: Mengubah persentase komisi platform secara fleksibel dengan pencatatan audit trail historis. Transaksi terdahulu terlindungi dengan *immutable snapshot* persentase komisi.
- **Audit Pesanan & Rekonsiliasi Pembayaran**: Memantau seluruh transaksi dan mencocokkan status pembayaran simulasi terhadap pesanan.

---

## 3. Aturan Bisnis & Formula Akuntansi Komisi

Sesuai rancangan inti manajemen akuntansi Fixlix:
- **Default Komisi Platform**: 25% (`0.2500`).
- **Komisi HANYA dikenakan pada Biaya Jasa Servis (Labor Fee)**.
- **Komponen Sparepart dan Biaya Tambahan 100% diteruskan ke teknisi (0% komisi)**.
- Seluruh perhitungan nominal uang menggunakan bilangan bulat Rupiah (integer IDR) tanpa floating point drift.

### Formula Wajib:
```text
commission = Math.round(labor_fee * commission_rate)

customer_total = labor_fee + parts_total + other_charges

technician_net = (labor_fee - commission) + parts_total + other_charges
```

### Privasi Tampilan:
- **Pelanggan** hanya melihat: Biaya Jasa, Sparepart, Biaya Tambahan, dan Total Pembayaran. Pelanggan tidak pernah melihat potongan komisi platform atau pendapatan bersih teknisi.
- **Teknisi** melihat: Preview rincian biaya, komisi platform, dan estimasi pendapatan bersih (*net payout*).

---

## 4. Tech Stack

- **Frontend & Full-stack**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode)
- **Styling & UI**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Database**: Neon Serverless PostgreSQL
- **ORM & Migrations**: Drizzle ORM, Drizzle Kit
- **Autentikasi**: Better Auth dengan Drizzle PostgreSQL Adapter
- **Testing**: Vitest untuk pengujian unit domain & state machine
- **Deployment**: Vercel-ready

---

## 5. Struktur Direktori Proyek

```text
├── drizzle/                  # File migrasi SQL Drizzle
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/         # Halaman publik (Beranda, Kategori, Teknisi, Layanan, FAQ, dll)
│   │   ├── (auth)/           # Halaman autentikasi (Masuk, Daftar)
│   │   ├── customer/         # Dashboard pelanggan, pesanan, checkout, review
│   │   ├── technician/       # Dashboard teknisi, order kustom, katalog, pendapatan
│   │   ├── admin/            # Dashboard eksekutif akuntansi, verifikasi, komisi
│   │   └── api/              # Route handlers untuk auth dan operasi bisnis
│   ├── components/
│   │   ├── ui/               # Komponen UI primitif (Button, Card, Badge, Input, dll)
│   │   └── shared/           # Komponen bersama (Navbar, Footer, WhatsAppButton, StarRating, dll)
│   ├── core/
│   │   └── domain/           # Entitas bisnis murni (Kalkulasi komisi, State Machine Order)
│   ├── modules/              # Application services (Catalog, Orders, Reviews, Admin)
│   ├── lib/
│   │   ├── auth/             # Konfigurasi Better Auth & helpers
│   │   ├── db/               # Koneksi Neon DB, Schema Drizzle, Seeder
│   │   └── utils.ts          # Format Rupiah, tanggal Asia/Jakarta, pembuat URL WhatsApp
├── design-reference/         # Panduan referensi desain visual
├── drizzle.config.ts         # Konfigurasi Drizzle ORM
├── package.json              # Dependencies dan scripts
├── tailwind.config.ts        # Konfigurasi tema dan design tokens
├── tsconfig.json             # Konfigurasi TypeScript strict
└── README.md                 # Dokumentasi utama proyek
```

---

## 6. Persyaratan Sistem & Instalasi

### Persyaratan
- Node.js 20+ (diuji pada Node.js v24.14.1)
- Akses database PostgreSQL (Neon PostgreSQL)

### Langkah Instalasi
1. Clone repositori ke mesin lokal Anda:
   ```bash
   git clone <repository-url>
   cd FIxLix
   ```

2. Instal dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Konfigurasi Environment Variable:
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel `DATABASE_URL` terhubung ke instance Neon PostgreSQL Anda.

4. Terapkan Skema Database & Jalankan Migrasi:
   ```bash
   npx tsx src/lib/db/migrate.ts
   ```

5. Jalankan Seeder Data Awal:
   ```bash
   npm run db:seed
   npx tsx src/lib/db/seed-accounts.ts
   ```

---

## 7. Akun Demo untuk Pengujian Cepat

Setelah menjalankan seeder, Anda dapat langsung menguji ketiga role akun:

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@fixlix.co.id` | `AdminFixlix123!` | Akses penuh dashboard akuntansi, pengaturan komisi, dan verifikasi teknisi. |
| **Teknisi** | `joko.teknisi@fixlix.co.id` | `Fixlix123!` | Spesialis AC & Pendingin (Verifikasi aktif). |
| **Teknisi** | `agus.reparasi@fixlix.co.id` | `Fixlix123!` | Spesialis Televisi & Audio. |
| **Teknisi** | `hendra.elektronik@fixlix.co.id` | `Fixlix123!` | Spesialis Rice Cooker & Kipas Angin. |
| **Pelanggan** | `budi.santoso@gmail.com` | `Fixlix123!` | Memiliki riwayat pesanan aktif dan selesai. |
| **Pelanggan** | `siti.aminah@gmail.com` | `Fixlix123!` | Memiliki riwayat pesanan kulkas dan rice cooker. |

---

## 8. Menjalankan Aplikasi

- **Development Server**:
  ```bash
  npm run dev
  ```
  Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

- **Menjalankan Unit Test**:
  ```bash
  npm run test
  ```

- **Production Build**:
  ```bash
  npm run build
  npm run start
  ```

---

## 9. Lisensi & Hak Cipta

Fixlix dikembangkan sebagai solusi marketplace perbaikan elektronik rumah tangga profesional yang siap dikembangkan lebih lanjut. Hak cipta dilindungi undang-undang.
