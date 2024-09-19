import { timeStamp } from "console";
import mongoose, { Schema, model, Types } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  role: "Cinema" | "Film Fanatic";
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["Cinema", "Film Fanatic"] },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
