import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// HTMLを配信
app.use(express.static(path.join(__dirname, "public")));

// Gemini中継API
app.post("/api/gemini", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativeai.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

app.use(express.static("public"));

app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
