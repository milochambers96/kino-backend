import { Request, Response } from "express";
import mongoose from "mongoose";
import Cinema from "../models/cinema";

export const getAllCinemas = async (req: Request, res: Response) => {
  try {
    const cinemas = await Cinema.find();
    res
      .status(200)
      .send(`Current cinemas listed on the Kino network are: ${cinemas}`);
    console.log("The following cinemas are on the network:", cinemas);
  } catch (error) {
    console.error(
      "The following error occured when the user tried to get all cinemas:",
      error
    );
    res.status(500).send({
      message: "Unable to locate any cinemas, please try searching again",
    });
  }
};
