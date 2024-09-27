import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { router } from "./config/router";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(mongoSanitize());
app.use(express.json());
app.use("/api", router);

const dbURI = process.env.DB_URI || "";
const PORT = process.env.PORT;

async function start() {
  await mongoose.connect(dbURI);
  console.log("🎞 " + " " + "Connected to the Kino Connection database 🎞");
  app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
  });
}

start();
