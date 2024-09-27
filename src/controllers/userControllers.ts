import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { checkPassword, validatePassword } from "../models/user";
import formatValidationError from "../errorMessages/validation.ts/validation";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const newUserDetails = req.body;
    const isPasswordAMatch: boolean = checkPassword(
      newUserDetails.password,
      newUserDetails.passwordConfirmation
    );
    if (!isPasswordAMatch) {
      return res.status(401).send({
        message: "Passwords do not match",
        errors: {
          password: "Passwords do not match. Please try again.",
          passwordConfirmation: "Passwords do not match. Please try again.",
        },
      });
    }
    const username = newUserDetails.username;
    const newUser = await User.create(newUserDetails);
    res.status(201).send(newUser);
    console.log(username, " has been added to the User DB.");
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "There was an error",
      errors: formatValidationError(error),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const incomingEmail = req.body.email;
    const incomingPassword = req.body.password;
    const foundUser = await User.findOne({ email: incomingEmail });
    const loginFailedMessage = "Login failed. Please check your credentials.";
    if (!foundUser) {
      console.log("Login failed - no user found");
      const error = loginFailedMessage;
      return res.status(401).json({
        message: loginFailedMessage,
        errors: formatValidationError(error),
      });
    }

    const isValidPassword: boolean = validatePassword(
      incomingPassword,
      foundUser.password
    );

    const secret = process.env.SECRET as string;

    if (isValidPassword) {
      const token = jwt.sign(
        { userId: foundUser._id, email: foundUser.email },
        secret,
        { expiresIn: "30d" }
      );
      console.log(
        "The requestor successfuly logged in as",
        foundUser,
        "The login token of the requestor is",
        token
      );
      return res.status(200).json({
        message: `Login successful. Hi ${foundUser.username}, welcome back to Kino Connect.`,
        token,
      });
    } else {
      console.log(
        "Login failed - the requestor provided an incorrect password."
      );
      return res.status(401).json({
        message: loginFailedMessage,
      });
    }
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to log in:",
      error
    );
    res.status(400).send({
      message: "There was an error",
      errors: formatValidationError(error),
    });
  }
};

export async function getCurrentUser(req: Request, res: Response) {
  console.log("res: ", req.currentUser);
  try {
    res.status(200).send(req.currentUser);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "There was an error, please try again later." });
  }
}
