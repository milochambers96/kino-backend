import mongoose, { Schema, model, Types } from "mongoose";

interface ICinema {
  name: string;
  bio: string;
  address: string;
  area: "North" | "East" | "South" | "West" | "Central";
  image: string;
  website: string;
  yearEst: number;
  screens: number;
  capacity: number;
  owner: Types.ObjectId;
}

const cinemaSchema: Schema<ICinema> = new Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  address: { type: String, required: true },
  area: {
    type: String,
    required: true,
    enum: ["North", "East", "South", "West", "Central"],
  },
  image: { type: String, required: true },
  website: { type: String, required: true },
  yearEst: { type: Number },
  screens: { type: Number },
  capacity: { type: Number },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

const Cinema = model<ICinema>("Cinema", cinemaSchema);

export default Cinema;
