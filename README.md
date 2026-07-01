# Sharing Vision - Article Management System

Aplikasi full-stack untuk manajemen artikel, dibuat menggunakan **Golang** (Gin + GORM) untuk backend dan **React** (Vite) untuk frontend.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Go, Gin, GORM |
| Frontend | React, Vite, Axios |
| Database | MySQL |

## Struktur Folder

```
sv-tes/
├── backend/
│   ├── main.go
│   ├── config/
│   │   └── database.go
│   ├── models/
│   │   └── post.go
│   ├── handlers/
│   │   └── article.go
│   ├── validators/
│   │   └── article.go
│   └── migrations/
│       └── migrate.go
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── api/
│       │   └── articleApi.js
│       ├── pages/
│       │   ├── AllPosts.jsx
│       │   ├── AddNew.jsx
│       │   └── Preview.jsx
│       └── components/
│           ├── Sidebar.jsx
│           └── Pagination.jsx
└── postman/
    └── sharing_vision.postman_collection.json
```

## Cara Menjalankan

### Prasyarat

- Go 1.21+
- Node.js 18+
- MySQL 8.x (pastikan sudah running)

### Backend

```bash
cd backend
go mod tidy
go run main.go
```

Backend akan jalan di `http://localhost:8080`. Database `article` dan tabel `posts` otomatis dibuat saat pertama kali dijalankan.

> **Catatan**: Default koneksi MySQL menggunakan user `root` tanpa password. Kalau pakai password, ubah DSN di `config/database.go`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan jalan di `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/article/` | Buat artikel baru |
| `GET` | `/article/{limit}/{offset}` | List artikel dengan pagination |
| `GET` | `/article/{id}` | Ambil detail artikel berdasarkan ID |
| `PUT` | `/article/{id}` | Update artikel |
| `PATCH` | `/article/{id}` | Update artikel (partial) |
| `DELETE` | `/article/{id}` | Hapus artikel |

### Contoh Request - Buat Artikel

```bash
curl -X POST http://localhost:8080/article/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Judul artikel yang cukup panjang ya",
    "content": "Isi konten artikel yang panjangnya minimal dua ratus karakter. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "category": "Tech",
    "status": "publish"
  }'
```

### Validasi

| Field | Rule |
|-------|------|
| `title` | Wajib, minimal 20 karakter |
| `content` | Wajib, minimal 200 karakter |
| `category` | Wajib, minimal 3 karakter |
| `status` | Wajib, salah satu dari: `publish`, `draft`, `thrash` |

## Halaman Frontend

1. **All Posts** (`/`) — Menampilkan tabel artikel dengan 3 tab: Published, Drafts, Trashed. Ada aksi edit dan trash.
2. **Add New** (`/add`) — Form untuk buat artikel baru dengan tombol Publish dan Draft.
3. **Edit** (`/edit/:id`) — Form edit artikel (pakai komponen yang sama dengan Add New).
4. **Preview** (`/preview`) — Tampilan blog dari artikel yang sudah di-publish, lengkap dengan pagination.

## Database Schema

### Tabel `posts`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `Id` | INT | Primary Key, Auto Increment |
| `Title` | VARCHAR(200) | Judul artikel |
| `Content` | TEXT | Isi artikel |
| `Category` | VARCHAR(100) | Kategori |
| `Created_date` | TIMESTAMP | Waktu dibuat |
| `Updated_date` | TIMESTAMP | Waktu terakhir diupdate |
| `Status` | VARCHAR(100) | `Publish` / `Draft` / `Thrash` |

## Postman Collection

Import file `postman/sharing_vision.postman_collection.json` ke Postman untuk testing semua endpoint.
