import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";

export const signup = async (req: Request, res: Response) => {
  try {
    const newUserDetails = req.body;
    const username = newUserDetails.username;
    const newUser = await User.create(newUserDetails);
    res.status(201).send(newUser);
    console.log(username, " has been added to the User DB.");
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Error signing up user. Please reivew submitted details.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  // try {
  //     const incomingCredentials = req.body
  // } catch (error) {
  // }
};
