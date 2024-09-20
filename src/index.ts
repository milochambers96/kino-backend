import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { router } from "./config/router";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const dbURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/kinoconnection";
// const port = process.env.PORT;

async function start() {
  await mongoose.connect(dbURI);
  console.log("🎞 " + " " + "Connected to the Kino Connection database 🎞");
  app.listen(8000, () => {
    console.log("Express API running on http://localhost:8000");
  });
}

start();
