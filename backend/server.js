require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {testdb  ,initDB} = require("./src/config/db");
const routes = require("./src/routes");
const { errorHandler } = require("./src/middleware/errorMiddleware");

const app = express();
testdb();
initDB();

app.use(
  cors({
    origin: ["http://localhost:5177", "http://localhost:5173"],
    credentials: true,
  }),
);

// --- STEP B: Standard Middleware --- 
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Serve is Running..");
  return res.json({ sucess: true, message: "Server started successfully" });
});

// --- STEP C: Routes ---
app.use("/api", routes);

// --- STEP D: Error Handling ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
