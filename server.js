import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/extract", upload.array("files"), async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) return res.status(400).send("No files uploaded.");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });
    const fileParts = await Promise.all(
      files.map(async (file) => {
        const data = await fs.promises.readFile(file.path, { encoding: "base64" });
        return { inlineData: { data, mimeType: file.mimetype } };
      })
    );

    const prompt = `You are an expert AI assistant for an abroad studies consultancy. Extract student profile information from uploaded documents following this structure:

[Student First Name] [Student Last Name]
Date of Birth: [DD/MM/YYYY]
Passport No.: [Passport Number]
Issue Date: [DD/MM/YYYY]
Expiry Date: [DD/MM/YYYY]
Personal Email: [Email]
Contact No.: [Contact Number]
10th - [Percentage] - [Board Name] - [Year] ||
12th - [Percentage] - [Board Name] - [Year] ||
12th English - [Marks] ||
[Bachelor Course] - [Percentage] - [University] - [Year] ||
If data is missing, write "Not available". No extra text.`;

    const result = await model.generateContent([{ parts: [...fileParts, { text: prompt }] }]);
    res.send(result.response.text());
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).send("Error generating summary.");
  } finally {
    (req.files || []).forEach((f) => fs.unlink(f.path, () => {}));
  }
});

// Serve frontend
app.use(express.static("public"));
app.get("*", (req, res) => res.sendFile(path.resolve("public", "index.html")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
