import { Request, Response } from "express";
import mongoose from "mongoose";
import Cinema from "../models/cinema";

export const getAllCinemas = async (req: Request, res: Response) => {
  try {
    const cinemas = await Cinema.find();
    res.status(200).send(cinemas);
    console.log("The following cinemas were sent to the client:", cinemas);
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to get all cinemas:",
      error
    );
    res.status(500).send({
      message: "Unable to locate any cinemas, please try searching again",
    });
  }
};

export const getACinema = async (req: Request, res: Response) => {
  try {
    const requestedCinemaId = req.params.cinemaId;
    const obtainedCinema = await Cinema.findById(requestedCinemaId);
    const cinemaName = obtainedCinema?.name;
    res.status(200).send(obtainedCinema);
    console.log(
      `${cinemaName} has been found in Kino's Cinema DB and sent to the requestor`
    );
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to access a specifc cinema:",
      error
    );
    res.status(449).send({
      message:
        "Unable to locate the requested cinema. Please try again with a valid cinema ID.",
    });
  }
};
