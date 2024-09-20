import mongoose, { Schema, model, Types } from "mongoose";
import validator from "validator";
import uniqueValidator from "mongoose-unique-validator";
import mongooseHidden from "mongoose-hidden";
import bcrypt from "bcrypt";

interface IUser {
  username: string;
  email: string;
  password: string;
  role: "Cinema" | "Film Fanatic";
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (email: string) => validator.isEmail(email),
    },
    password: {
      type: String,
      required: true,
      hide: true,
      validate: (password: string) =>
        validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
    },
    role: { type: String, required: true, enum: ["Cinema", "Film Fanatic"] },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseHidden({ defaultHidden: { password: true } }));

userSchema.pre("save", function hashPassword(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  next();
});

export function checkPassword(password: string, passwordConfirmation: string) {
  return password === passwordConfirmation;
}

export function validatePassword(
  plainTextPassword: string,
  hashedPasswordfromDB: string
) {
  return bcrypt.compareSync(plainTextPassword, hashedPasswordfromDB);
}

const User = model<IUser>("User", userSchema);

export default User;
