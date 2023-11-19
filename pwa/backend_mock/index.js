import express from "express";
import cors from "cors";
// import mongoose from 'mongoose';
const app = express();

// mongoose.connect('mongodb://127.0.0.1:27017/pwa');
import router from "./controllers/index.js";

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://localhost:3000",
    "https://exilirate.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(cors());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(5050, () => {
  console.log("mock backend running on port 5050");
});
