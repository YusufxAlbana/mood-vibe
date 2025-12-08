# 🎵 Mood Vibe

Aplikasi web yang menganalisis *mood* kamu berdasarkan cerita harian dan merekomendasikan lagu-lagu Spotify yang cocok.

![Mood Vibe Preview](https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80)

## ✨ Fitur Utama

- **📝 Mood Journal** — Ceritakan perasaan/hari kamu dalam bentuk teks
- **🤖 AI Analysis** — Gemini AI menganalisis mood dari ceritamu
- **🎵 Song Recommendations** — Dapatkan rekomendasi lagu berdasarkan mood
- **🎧 Spotify Player** — Dengarkan lagu langsung di aplikasi dengan Spotify Embed
- **🖼️ Dynamic Backgrounds** — Latar belakang landscape yang berganti otomatis

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| React 19 | Frontend framework |
| Vite | Build tool & dev server |
| Google Gemini AI | Mood analysis |
| Spotify Embed | Music player (no API key needed) |

## 🚀 Cara Menjalankan di Laptop Sendiri

### Prerequisites
- **Node.js** v18 atau lebih baru
- **npm** (sudah termasuk dengan Node.js)

### Langkah-langkah

1. **Clone atau download project ini**
   ```bash
   git clone <repository-url>
   cd spotify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka di browser**
   ```
   http://localhost:5173
   ```

## 📖 Cara Kerja Aplikasi

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INPUT                           │
│         "Hari ini aku senang banget dapat nilai A!"         │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     GEMINI AI ANALYSIS                      │
│     Menganalisis teks dan menentukan mood: "Senang" 😊      │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      SONG DATABASE                          │
│   Mencari lagu dari database lokal berdasarkan mood         │
│   (src/services/songDatabase.js)                            │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     SPOTIFY EMBED                           │
│   Menampilkan player Spotify dengan iframe embed            │
│   (Tidak butuh API key, langsung embed dari Spotify)        │
└─────────────────────────────────────────────────────────────┘
```

### Alur Detail:

1. **User menulis cerita** di textarea
2. **Gemini AI** (`services/gemini.js`) menganalisis teks dan mengembalikan mood + emoji
3. **Song Database** (`services/songDatabase.js`) mencari lagu berdasarkan mood yang terdeteksi
4. **Spotify Embed** menampilkan player menggunakan `spotifyId` dari database
5. User bisa memilih lagu lain dari daftar rekomendasi

## 📁 Struktur Project

```
src/
├── components/
│   └── MoodJournal.jsx    # Komponen utama aplikasi
├── pages/
│   └── HomePage.jsx       # Halaman utama
├── services/
│   ├── gemini.js          # Koneksi ke Gemini AI
│   └── songDatabase.js    # Database lagu per mood
├── assets/
│   └── logo.svg           # Logo aplikasi
└── App.jsx                # Root component
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code dengan ESLint |

## 🎨 Customization

### Menambah Lagu Baru
Edit file `src/services/songDatabase.js` dan tambahkan lagu dengan format:
```javascript
{
    title: "Judul Lagu",
    artist: "Nama Artis", 
    spotifyId: "SPOTIFY_TRACK_ID"  // Dapat dari URL Spotify
}
```

> **Tip:** Untuk mendapatkan `spotifyId`, buka lagu di Spotify → Share → Copy Link  
> URL: `https://open.spotify.com/track/ABC123xyz` → ID: `ABC123xyz`

---

Made with ❤️ by King Yusuf dari Aceh
