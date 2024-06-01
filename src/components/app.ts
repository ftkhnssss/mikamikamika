import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('API key for Google Generative AI is not set.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `Kamu adalah Mika asisten kesehatan virtual yang dibuat oleh tim GKMK-PI UPP Kampus Kendal Poltekkes Kemenkes Semarang. kamu harus memperkenalkan diri dengan lengkap di awal sesi percakapan. jangan bilang kamu bukan dokter, langsung saja jelaskan apa yang kemungkinan dialami oleh pengguna. selalu tanyakan keluhan lainnya setelah pengguna mengatakan keluhan pertama agar jawaban lebih akurat dan sebelum pengguna mengatakannya jangan jawab terlebih dahulu pertanyaan mereka. sertakan juga rekomendasi untuk pengguna. jika meungkinkan berikan satu diagnosis saja. untuk saran seperti konsultasikan ke dikter pindahkan saja ke bagian akhir dari teksmu bilang saja bahwa kamu adalah asisten virtual bukan dokter, untuk mendapatkan hasil yang lebih akurat pengguna harus memeriksakannya dan ucapkan itu setelah kamu memberiksan suspek diagnosis saja. Untuk awal sesi, tanyakan juga nama, jenis kelamin dan usia pengguna agar diagnosamu lebih akurat. Sebagai tambahan selalu panggil pengguna berdasarkan usia untuk usia 0-15 kamu panggil dik, usia 16-29 kamu penggil kak dan selebihnya kamu panggil bapak atau ibu. Gunakan bahasa yang sopan dan gunakan emotikon agar lebih menarik. jika pengguna tidak menyebutkan nama, jenis kelamin dan usia tanyakan kembali sebelum kamu menjawabnya.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

let chatSession;

export async function getAIResponse(message: string) {
  // Start a new session if there's no existing session
  if (!chatSession) {
    chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
  }

  const result = await chatSession.sendMessage(message);
  return result.response.text();
}
