import { GoogleGenAI } from "@google/genai";

// Initialize the client with API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDas9RSrxmDczmpXGJQi_-WQBpcZXLowds';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Personality traits mapping
const PERSONALITY_MAP = {
    friendly: 'ramah dan bersahabat',
    funny: 'humoris dan suka bercanda',
    serious: 'serius dan profesional',
    romantic: 'romantis dan penuh perhatian',
    wise: 'bijaksana dan penuh nasihat',
    energetic: 'penuh semangat dan energik',
    calm: 'tenang dan santai',
    sarcastic: 'sarkastik tapi tetap sopan'
};

// Speaking style mapping
const SPEAKING_STYLE_MAP = {
    santai: 'Gunakan bahasa santai dan casual, seperti ngobrol dengan teman',
    formal: 'Gunakan bahasa formal dan profesional',
    gaul: 'Gunakan bahasa gaul dengan slang Indonesia modern',
    puitis: 'Gunakan bahasa puitis dan artistik yang indah',
    pendek: 'Berikan jawaban singkat dan to the point'
};

// Build dynamic system prompt based on config
export const buildSystemPrompt = (config) => {
    if (!config || !config.name) {
        // Default prompt if no config
        return `Kamu adalah asisten AI bernama "Vibe AI". Jawab dengan ramah dan helpful.`;
    }

    const personalityTraits = config.personality
        .map(id => PERSONALITY_MAP[id])
        .filter(Boolean)
        .join(', ');

    const genderText = config.gender === 'pria' ? 'laki-laki' 
        : config.gender === 'wanita' ? 'perempuan' 
        : 'netral (tidak spesifik gender)';

    const ageText = config.age ? `berusia ${config.age}` : '';

    const speakingStyleText = SPEAKING_STYLE_MAP[config.speakingStyle] || SPEAKING_STYLE_MAP.santai;

    return `[INSTRUKSI SISTEM - WAJIB DIIKUTI TANPA PENGECUALIAN]

Kamu adalah AI bernama "${config.name}".
${ageText ? `Umur: ${ageText}` : ''}
Gender: ${genderText}
Pembuat: ${config.creator || 'King Yusuf Dari Aceh'}

KEPRIBADIAN:
${personalityTraits ? `- Sifat utama: ${personalityTraits}` : '- Sifat: ramah dan helpful'}
${config.customDescription ? `- Detail khusus: ${config.customDescription}` : ''}

GAYA BICARA:
${speakingStyleText}

ATURAN WAJIB:
1. SELALU berperan sebagai "${config.name}" - ini adalah identitasmu
2. Jawab sesuai kepribadian yang sudah ditentukan di atas
3. Gunakan bahasa yang sama dengan pengguna
4. JANGAN pernah menyebut bahwa kamu adalah AI buatan Google atau Gemini
5. Jika ditanya siapa pembuatmu, jawab: "${config.creator || 'King Yusuf Dari Aceh'}"
6. Jika ditanya namamu, jawab: "${config.name}"
7. Tetap sopan dan helpful dalam semua situasi
8. Tambahkan emoji yang sesuai untuk membuat percakapan lebih hidup

Mulai sekarang, jawab HANYA sebagai "${config.name}":
`;
};

export const sendMessage = async (message, conversationHistory = [], aiConfig = null) => {
    try {
        // Build conversation context with dynamic system prompt
        let fullPrompt = buildSystemPrompt(aiConfig);
        
        if (conversationHistory.length > 0) {
            const aiName = aiConfig?.name || 'AI';
            fullPrompt += '\n[RIWAYAT CHAT]\n';
            fullPrompt += conversationHistory.map(msg => 
                `${msg.role === 'user' ? 'User' : aiName}: ${msg.content}`
            ).join('\n');
            fullPrompt += '\n[AKHIR RIWAYAT]\n\n';
        }
        
        const aiName = aiConfig?.name || 'AI';
        fullPrompt += `User: ${message}\n\n${aiName}:`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });

        if (response.text) {
            return {
                success: true,
                message: response.text
            };
        } else {
            throw new Error('No response text received');
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        return {
            success: false,
            message: error.message || 'Gagal berkomunikasi dengan AI. Coba lagi nanti.'
        };
    }
};

// Analyze user's mood based on their daily story
export const analyzeMood = async (userText) => {
    try {
        const prompt = `Kamu adalah AI yang ahli dalam menganalisis mood dan emosi seseorang berdasarkan cerita atau curhatan mereka.

Analisis teks berikut dan tentukan mood utama orang tersebut:

"${userText}"

Berikan respons dalam format JSON yang VALID (tanpa markdown, tanpa backticks):
{
    "mood": "nama mood dalam bahasa Indonesia. PILIH SATU dari daftar berikut: Senang, Bahagia, Gembira, Bersyukur, Sedih, Galau, PatahHati, Kecewa, Tenang, Santai, Damai, Semangat, Bersemangat, Fokus, Romantis, Cinta, Rindu, Cemas, Stres, Khawatir, Lelah, Capek, Marah, Kesal, Bingung, Nostalgia, Bangga, Netral",
    "emoji": "satu emoji yang paling mewakili mood tersebut",
    "insight": "penjelasan singkat 1 kalimat tentang mood tersebut"
}

PENTING: 
- mood HARUS salah satu dari pilihan yang diberikan (case sensitive, tanpa spasi)
- Pilih mood yang paling spesifik dan cocok
- Respons HANYA berupa JSON valid, tanpa teks tambahan apapun.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        if (response.text) {
            let cleanedText = response.text.trim();
            cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
            
            const parsed = JSON.parse(cleanedText);
            return {
                success: true,
                data: parsed
            };
        } else {
            throw new Error('No response text received');
        }
    } catch (error) {
        console.error('Mood Analysis Error:', error);
        return {
            success: false,
            message: error.message || 'Gagal menganalisis mood. Coba lagi nanti.'
        };
    }
};

// Get trending playlist recommendations from AI
export const getTrendingPlaylists = async () => {
    try {
        const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        
        const prompt = `Kamu adalah ahli musik dan kurator playlist Spotify.

Hari ini adalah ${today}. Berikan 6 rekomendasi playlist yang sedang trending dan cocok untuk berbagai mood.

Format respons sebagai JSON array yang VALID (tanpa markdown, tanpa backticks):
[
    {
        "name": "nama playlist yang bisa dicari di Spotify",
        "mood": "mood singkat dalam 2-3 kata",
        "emoji": "emoji yang mewakili playlist"
    }
]

Contoh nama playlist yang bagus: "Chill Vibes", "Morning Coffee", "Workout Hits", "Late Night Feels", "Happy Hits Indonesia", "Lo-Fi Study Beats"

PENTING: 
- Berikan playlist yang NYATA dan bisa ditemukan di Spotify
- Campuran antara playlist internasional dan Indonesia
- Respons HANYA berupa JSON array valid`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        if (response.text) {
            let cleanedText = response.text.trim();
            cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
            
            const parsed = JSON.parse(cleanedText);
            return {
                success: true,
                data: parsed
            };
        } else {
            throw new Error('No response text received');
        }
    } catch (error) {
        console.error('Trending Playlists Error:', error);
        // Return fallback playlists if AI fails
        return {
            success: true,
            data: [
                { name: "Today's Top Hits", mood: "Popular & Fresh", emoji: "🔥" },
                { name: "Chill Hits", mood: "Santai", emoji: "🍃" },
                { name: "Happy Hits Indonesia", mood: "Senang", emoji: "😊" },
                { name: "Lo-Fi Beats", mood: "Fokus", emoji: "🎧" },
                { name: "Workout Beats", mood: "Semangat", emoji: "💪" },
                { name: "Sleep", mood: "Tidur", emoji: "🌙" }
            ]
        };
    }
};

