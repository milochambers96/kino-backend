import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
// app.use("api", router);

const dbURI = process.env.DB_URI;

async function start() {
  await mongoose.connect("mongodb://127.0.0.1:27017/kinoconnection");
  console.log("Connected to the Kino Connection database 🎥");
  app.listen(8500, () => {
    console.log("Express API running on http://localhost:8500");
  });
}

start();
