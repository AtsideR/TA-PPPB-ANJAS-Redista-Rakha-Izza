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

app.use("/api/anjem", anjemRoutes);
app.use("/api/jastip", jastipRoutes);

// JSON parse error handler: return 400 when request body is invalid JSON
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
