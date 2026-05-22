# Task: Implementasi Fitur Registrasi User Baru

Dokumen ini berisi spesifikasi dan tahapan detail untuk mengimplementasikan fitur registrasi user baru. Silakan ikuti langkah-langkah di bawah ini secara berurutan.

## Spesifikasi Kebutuhan

### 1. Database Schema
Buat tabel `users` dengan struktur sebagai berikut:
- `id`: integer, auto increment, primary key
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (password harus disimpan dalam bentuk hash menggunakan algoritma **bcrypt**)
- `created_at`: timestamp, default `current_timestamp`

### 2. Spesifikasi API
- **Endpoint**: `POST /api/users`

**Request Body JSON:**
```json
{
    "name" : "Eko",
    "email" : "eko@locahost",
    "password" : "rahasia"
}
```

**Response Body (Success 2xx):**
```json
{
    "data" : "OK"
}
```

**Response Body (Error - Jika Email Sudah Terdaftar 400):**
```json
{
    "error" : "Email sudah terdaftar"
}
```

### 3. Struktur Folder dan File
Struktur kode di dalam folder `src` harus mengikuti format berikut:
- **`src/routes/`**: Tempat meletakkan file routing Elysia.js. Contoh penamaan file: `users-route.ts`
- **`src/services/`**: Tempat meletakkan file logic bisnis aplikasi. Contoh penamaan file: `users-service.ts`

---

## Tahapan Implementasi

Berikut adalah langkah-langkah detail (step-by-step) untuk mengimplementasikan fitur ini:

### Langkah 1: Update Schema Database
1. Buka file schema database Drizzle ORM (biasanya di `src/db/schema.ts`).
2. Definisikan/tambahkan skema untuk tabel `users` sesuai spesifikasi di atas.
3. Jangan lupa tandai kolom `email` sebagai unique dan `created_at` default timestamp sekarang.
4. Pastikan untuk men-generate/push skema terbaru ke database (contoh: `bun run db:push` atau `bun run db:generate`).

### Langkah 2: Buat User Service (Business Logic)
1. Buat folder `src/services` jika belum ada.
2. Buat file baru dengan nama `src/services/users-service.ts`.
3. Di dalam file ini, buat sebuah fungsi (misalnya `registerUser`) yang menerima input `name`, `email`, dan `password`.
4. Implementasikan logic pengecekan email:
   - Query database untuk mencari apakah user dengan email tersebut sudah ada.
   - Jika sudah ada, lemparkan error/kembalikan penanda bahwa email sudah terdaftar.
5. Implementasikan logic hashing password:
   - Hash password menggunakan fasilitas yang tersedia (misal `Bun.password.hash` dengan algoritma bcrypt).
6. Simpan data user (name, email, hashed password) ke dalam database menggunakan Drizzle ORM.
7. Return hasil sukses.

### Langkah 3: Buat User Route (Endpoint API)
1. Buat folder `src/routes` jika belum ada.
2. Buat file baru dengan nama `src/routes/users-route.ts`.
3. Gunakan instance dari Elysia untuk mendefinisikan rute `POST /`. (Nantinya dipasang prefix `/api/users`).
4. Di dalam rute ini, baca request body `name`, `email`, dan `password`. Sangat disarankan menambahkan validasi tipe data (menggunakan Elysia `t` / typebox).
5. Panggil fungsi `registerUser` dari `users-service.ts`.
6. Tangani hasil kembaliannya:
   - Jika service mengembalikan error "Email sudah terdaftar", set response status menjadi HTTP error (misal 400 Bad Request) dan kembalikan JSON `{"error": "Email sudah terdaftar"}`.
   - Jika sukses, set status (misal 201 Created) dan kembalikan JSON `{"data": "OK"}`.

### Langkah 4: Registrasi Route di Main App
1. Buka file utama aplikasi (misal `src/index.ts`).
2. Import `users-route.ts`.
3. Daftarkan/pasang routing tersebut pada instance Elysia utama dengan prefix `/api/users`. (Contoh: `app.use('/api/users', usersRoute)` atau dengan cara grup yang disediakan Elysia).

### Langkah 5: Testing
1. Jalankan aplikasi secara lokal (contoh: `bun run dev`).
2. Gunakan HTTP client (seperti Postman, Insomnia, atau cURL) untuk mengetes endpoint `POST /api/users`.
3. Uji skenario sukses: Pastikan data masuk ke DB dan password ter-hash bcrypt.
4. Uji skenario gagal: Coba daftar menggunakan email yang persis sama dengan sebelumnya, dan pastikan mendapat pesan error `{"error" : "Email sudah terdaftar"}`.
