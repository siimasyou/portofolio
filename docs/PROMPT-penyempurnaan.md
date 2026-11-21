# Prompt penyempurnaan portofolio

Salin semua isi di bawah garis ke asisten AI pengkode (Claude Code, Cursor, dan sejenisnya) yang dibuka di folder proyek ini.

---

Kamu bekerja di proyek situs portofolio statis milik **Atin Nur'jannah**, lulusan S1 Pendidikan Biologi Universitas Tanjungpura (Pontianak) yang mencari kerja di bidang manajemen, komunikasi, administrasi, pengelolaan media sosial, dan pengembangan konten. Situs sudah berjalan. Tugasmu menyempurnakannya tanpa mengubah arah desain.

## Aturan keras

1. **Jangan menjalankan `git commit`, `git push`, `git init`, atau `npm run deploy`.** Pemilik proyek yang melakukannya sendiri. Boleh membaca status git bila perlu.
2. Jangan menambah framework atau proses build yang berat. Proyek ini HTML, CSS, dan JavaScript murni. Boleh menambah dependensi pengembangan kecil bila benar-benar perlu, dan sebutkan alasannya.
3. Jangan mengarang data. Semua isi harus berasal dari CV dan materi yang ada di folder `assets/`. Kalau butuh fakta baru (nama lomba, tautan akun, tanggal), tulis sebagai pertanyaan di laporan akhir, bukan sebagai isi situs.
4. Jangan menggambar ulang logo merek. Logo Canva dan Microsoft Office di `assets/logos/` adalah file yang disediakan pemilik.
5. Pertahankan arah desain: feminin, pastel, bernuansa 3D, dengan minat media sosial dan konten. Warna dasar ada di variabel `:root` pada `css/style.css` (navy, biru langit, peach, mint, kuning mentega). Jangan kembali ke ungu atau pink.
6. Bahasa situs adalah Bahasa Indonesia, kalimat biasa dengan huruf kapital hanya di awal kalimat. Tombol memakai kata kerja yang jelas.

## Peta proyek

- `index.html`: isi halaman. Bagian: beranda (hero dua foto 3D), tentang (kartu profil yang bisa dibalik), organisasi (Himbio: ponsel 3D, carousel konten, kartu Instagram dan Facebook), pengalaman lainnya (tumpukan kartu), keahlian (empat kartu logo), kontak.
- `css/style.css`: semua gaya. Navbar berubah menjadi tab bar bawah di layar 860px ke bawah.
- `js/main.js`: parallax dan putar 3D, ponsel yang berganti slide, kartu profil, carousel (`works`), tumpukan pengalaman (`xp`), kartu miring, animasi obrolan, tombol salin.
- `scripts/build.mjs`: memeriksa referensi lokal lalu menyalin ke `dist/`. Tambahkan halaman atau folder baru ke daftar `publish` di sini.
- `assets/img/`, `assets/logos/`: gambar. Foto Atin ada di `foto-wisuda.jpg`, `foto-studio.jpg`, `foto-wajah.jpg`.

## Yang perlu disempurnakan

### 1. Isi dan keakuratan
- Baca ulang semua teks. Pastikan setiap klaim sesuai CV: peran, tahun, urutan pengalaman, nama institusi.
- Angka pengikut Instagram dan Facebook diambil dari tangkapan layar akun himpunan, bukan milik Atin pribadi. Pertahankan keterangan itu.
- Dua konten (`konten-info-lomba.jpg`, `konten-simbiosis-2023.jpg`) berasal dari tangkapan layar beresolusi rendah. Beri tanda di laporan bila ada keterangan yang masih menebak, misalnya nama lomba.
- Daftar pertanyaan untuk pemilik: tautan Instagram dan Facebook resmi, tautan LinkedIn bila ada, file CV untuk diunduh, nomor WhatsApp bila ingin ditampilkan, foto wajah yang lebih dekat untuk kartu profil.

### 2. SEO dan metadata
- Tambahkan `meta description`, `theme-color`, tag Open Graph dan Twitter Card, `canonical` (kosongkan placeholder domain dan beri komentar), serta favicon (buat sendiri dari monogram, jangan memakai logo merek).
- Tambahkan data terstruktur `Person` (JSON-LD) yang hanya memakai data dari CV.
- Siapkan gambar pratinjau `assets/img/og.jpg` (1200x630) dari komposisi yang ada.

### 3. Performa
- Konversi foto dan poster ke WebP atau AVIF dengan cadangan JPEG lewat `<picture>`. Pertahankan ketajaman. Simpan file asli di luar `dist`.
- Beri `loading="lazy"` dan `decoding="async"` pada gambar di bawah layar pertama, serta `width` dan `height` agar tidak ada loncatan tata letak.
- Pertimbangkan memuat font lebih ringan (kurangi bobot yang tidak dipakai) dan tambahkan cadangan font yang rapi.
- Pastikan animasi hanya memakai `transform` dan `opacity`, dan berhenti saat tab tidak aktif atau elemen tidak terlihat (misalnya putaran ponsel dan `requestAnimationFrame`).
- Target: skor Lighthouse mobile di atas 90 untuk Performance, Accessibility, Best Practices, dan SEO.

### 4. Aksesibilitas
- Tab pengalaman memakai `role="tablist"`, `role="tab"`, `aria-selected`. Lengkapi dengan `role="tabpanel"`, `aria-controls`, dan navigasi panah.
- Carousel konten: tambahkan label, tombol sebelumnya dan berikutnya yang bisa difokus, pengumuman perubahan lewat `aria-live`, dan jeda otomatis pada ponsel bila pengguna memintanya.
- Pastikan kontras teks minimal WCAG AA, terutama teks abu-abu kebiruan di atas latar pastel dan teks kecil di tab bar.
- Fokus keyboard harus terlihat di semua elemen interaktif. Hormati `prefers-reduced-motion` di CSS dan JS.
- Beri teks alternatif yang bermakna untuk semua gambar. Foto dekoratif memakai `alt=""`.
- Kartu profil yang bisa dibalik harus terbaca oleh pembaca layar kedua sisinya.

### 5. Desain dan interaksi 3D
- Periksa tiap bagian di lebar 320, 360, 390, 430, 768, 1024, 1280, dan 1536 piksel. Cari teks terpotong, tumpang tindih, ruang kosong berlebihan, dan elemen yang keluar layar.
- Haluskan transisi ponsel 3D, tumpukan kartu pengalaman, dan carousel. Hindari patah-patah di perangkat kelas menengah.
- Pastikan semua interaksi bisa dipakai dengan sentuhan, bukan hanya kursor.
- Pertahankan satu momen animasi yang menonjol (hero dan gelembung obrolan). Jangan menambah animasi masuk di setiap bagian.
- Pertimbangkan bagian bukti tambahan hanya bila ada materi nyata di `assets/`.

### 6. Kualitas kode
- Pisahkan data (`works`, `xp`) dari logika di `js/main.js` bila membuat kode lebih mudah diubah.
- Hapus CSS dan JS yang tidak terpakai. Pastikan tidak ada nama kelas yang bentrok (pernah terjadi pada `.top`).
- Tambahkan komentar singkat hanya di bagian yang tidak jelas. Jaga README tetap akurat.
- Jalankan `npm run check` setelah setiap perubahan. Jalankan `npm run preview` untuk melihat hasil build.

## Cara bekerja
1. Baca seluruh proyek lebih dulu. Buat daftar temuan berurutan dari yang paling penting.
2. Kerjakan per kelompok (isi, SEO, performa, aksesibilitas, desain, kode). Setelah tiap kelompok, jalankan `npm run check` dan lihat hasilnya di browser pada lebar HP dan desktop.
3. Jangan menyatakan selesai sebelum membuktikannya: tampilkan hasil pemeriksaan, tangkapan layar, atau angka Lighthouse.

## Hasil akhir yang diminta
- Perubahan pada file proyek (tanpa commit dan tanpa push).
- Laporan singkat: apa yang diubah, apa yang belum bisa dibuktikan, dan daftar pertanyaan untuk pemilik.
- Ringkasan angka sebelum dan sesudah (ukuran halaman, skor Lighthouse) bila bisa diukur.
