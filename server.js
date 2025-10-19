import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Default route → serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Example API route (optional)
app.get("/api/extract", (req, res) => {
  res.json({ message: "API is working fine!" });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
