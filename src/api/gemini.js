// src/api/gemini.js
export async function askGemini(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    let text = data.candidates[0].content.parts[0].text;

    // ✨ Markdown işaretlerini temizle
    text = text.replace(/```json\n?|```/g, "").trim();

    return text;
  } else {
    throw new Error("Yanıt alınamadı.");
  }
}
