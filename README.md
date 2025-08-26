# 📚 Sistem Informasi Perangkat Pembelajaran

Aplikasi sederhana berbasis **Google Apps Script + Google Drive + Spreadsheet** untuk mengelola media pembelajaran guru.

## 🚀 Fitur
- Input Nama Guru + NIP
- Upload media pembelajaran (PDF, PPT, Word, dll) ke Google Drive
- Tabel daftar media pembelajaran tersimpan di Spreadsheet
- Link otomatis tersimpan di tabel

## ⚙️ Cara Pakai
1. Buat Spreadsheet baru dengan sheet bernama `data`
   - Kolom: NO, NAMA GURU, NIP, LINK MEDIA PEMBELAJARAN
2. Buat folder di Google Drive untuk menyimpan file
3. Copy **Folder ID** dan **Spreadsheet ID**
4. Buka [Google Apps Script](https://script.google.com/)
5. Upload `Code.gs` dan `index.html`
6. Deploy sebagai Web App (akses siapa saja dengan link)

