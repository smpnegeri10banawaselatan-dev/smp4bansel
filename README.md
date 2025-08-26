# Attendance Upload System

Sistem ini memungkinkan pengguna mengunggah dokumen guru ke Google Drive dan otomatis memperbarui kolom **Media** di Google Sheet.

## 📌 Fitur
- Menampilkan daftar guru dari Google Sheet (`No`, `Nama Guru`, `NIP`, `Media`)
- Upload file ke folder Google Drive tertentu
- Update kolom **Media** di baris guru yang dipilih
- Tambah baris baru jika guru belum ada di sheet
- Tabel data terkini langsung tampil di halaman

## ⚙️ Konfigurasi

### 1. Siapkan Google Sheet
- Gunakan Sheet ID: `1SVtLNZouu5qEQ4g8VXmgsDZL1uZqxgXRjQYLYznkaGY`
- Nama sheet: `data`
- Kolom: `No | Nama Guru | NIP | Media`

### 2. Siapkan Folder Google Drive
- Folder ID: `1zHJ0BXe2AUGogJk7qAg9NHJwJHdMw1-F`
- Pastikan akun Apps Script punya akses ke folder ini

### 3. Deploy Backend
- Buka [Google Apps Script](https://script.google.com)
- Buat project baru, paste isi `backend.gs`
- Deploy sebagai **Web App**:
  - Execute as: **Me**
  - Who has access: **Anyone**
- Salin URL Web App

### 4. Konfigurasi Frontend
- Buka `index.html`
- Ganti `WEB_APP_URL` dengan URL Web App dari langkah 3

### 5. Hosting
- Bisa di-host di GitHub Pages atau server lain
- Atau langsung buka file `index.html` di browser

## 🚀 Cara Pakai
1. Pilih guru dari daftar atau isi NIP/No/Nama
2. Pilih file yang akan diunggah
3. Klik **Upload**
4. Link file akan otomatis muncul di kolom **Media** pada Google Sheet

## 📜 Lisensi
Bebas digunakan dan dimodifikasi untuk kebutuhan internal.
