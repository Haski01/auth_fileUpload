// entry point
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import connectToMongoose from "./config/db.js";

dotenv.config();
const app = express();

// allow JSON bodies and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow credentials
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  })
);

// testing route
app.get("/", (req, res) => {
  res.send("Working, test");
});

// routes
app.use("/api/users", authRoutes);

// connect db & start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server start listening on PORT: ${PORT}`);
  connectToMongoose();
});
