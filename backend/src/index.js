// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const anjemRoutes = require("./routes/anjemRoutes");
const jastipRoutes = require("./routes/jastipRoutes");

app.get("/", (req, res) => {
  res.send("API Anjem & Jastip Running 🚀");
});

app.use("/api/anjem", require("./routes/anjemRoutes"));
app.use("/api/jastip", require("./routes/jastipRoutes"));

// JSON parse error handler: return 400 when request body is invalid JSON
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

app.listen(3000, () => console.log("Server running"))

// Export the app so it can be consumed by a serverless wrapper (Vercel)
module.exports = app;
