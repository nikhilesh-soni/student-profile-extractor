import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Handle file paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /public folder
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON request bodies
app.use(express.json());

// Root route → serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Example route for Gemini API (you can modify this later)
app.post("/api/extract", async (req, res) => {
  try {
    res.json({ message: "API working fine!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
