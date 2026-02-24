require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes"); // must be router
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "CSV API running" });
});

// // ✅ debug (temporarily)
// console.log("routes typeof:", typeof routes);
// console.log("errorMiddleware typeof:", typeof errorMiddleware);

app.use("/api", routes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));