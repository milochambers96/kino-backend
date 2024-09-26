import mongoose, { Schema, model, Types } from "mongoose";

interface ICinema {
  name: string;
  bio: string;
  address: string;
  buildingNo: string;
  street: string;
  city: "London";
  postcode: string;
  area: "North" | "East" | "South" | "West" | "Central";
  borough: string;
  image: string;
  website: string;
  yearEst: number;
  screens: number;
  capacity: number;
  owner: Types.ObjectId;
}

const cinemaSchema: Schema<ICinema> = new Schema({
  name: { type: String, required: true, unique: true },
  bio: { type: String, required: true },
  address: { type: String, required: true },
  buildingNo: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true, enum: ["London"] },
  postcode: { type: String, required: true },
  area: {
    type: String,
    required: true,
    enum: ["North", "East", "South", "West", "Central"],
  },
  borough: { type: String, required: true },
  image: { type: String, required: true },
  website: { type: String, required: true },
  yearEst: { type: Number },
  screens: { type: Number },
  capacity: { type: Number },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Cinema = model<ICinema>("Cinema", cinemaSchema);

export default Cinema;
