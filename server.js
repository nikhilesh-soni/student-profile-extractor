import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS and JSON
app.use(cors());
app.use(express.json());

// Fix path handling for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the /public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Example API route (optional)
app.get("/api/extract", (req, res) => {
  res.json({ message: "API working fine!" });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
