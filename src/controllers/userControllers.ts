import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { checkPassword, validatePassword } from "../models/user";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const newUserDetails = req.body;
    const isPasswordAMatch: boolean = checkPassword(
      newUserDetails.password,
      newUserDetails.passwordConfirmation
    );
    if (!isPasswordAMatch) {
      return res.status(401).json({
        message: "The inputted passwords do not match. Please try again.",
      });
    }
    const username = newUserDetails.username;
    const newUser = await User.create(newUserDetails);
    res.status(201).send(newUser);
    console.log(username, " has been added to the User DB.");
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error signing up user. Please reivew submitted details.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const incomingEmail = req.body.email;
    const incomingPassword = req.body.password;
    const foundUser = await User.findOne({ email: incomingEmail });
    const loginFailedMessage =
      "Login failed. Please check your credentials and try again!";
    if (!foundUser) {
      console.log("Login failed - no user found");
      return res.status(401).json({
        message: loginFailedMessage,
      });
    }

    const isValidPassword: boolean = validatePassword(
      incomingPassword,
      foundUser.password
    );

    if (isValidPassword) {
      const token = jwt.sign(
        { userId: foundUser._id, email: foundUser.email },
        process.env.SECRET || "development secret",
        { expiresIn: "30d" }
      );
      console.log(
        "The requestor successfuly logged in as",
        foundUser,
        "The login token of the requestor is",
        token
      );
      return res.status(200).json({
        message: `Login successful, welcome back ${foundUser.username}`,
      });
    } else {
      console.log(
        "Login failed - the requestor provided an incorrect password"
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
    return res.status(500).json({
      message:
        "An error occured when attemptingto login the user. Please try again.",
    });
  }
};
