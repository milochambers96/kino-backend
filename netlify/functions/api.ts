import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { router } from "../../src/config/router";
import mongoose from "mongoose";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use("/api", router);

const dbURI = process.env.DB_URI as string;

async function start() {
  await mongoose.connect(dbURI);
  console.log("🎞 " + " " + "Connected to the Kino Connection database 🎞");
}

start();

export const handler = serverless(app);
