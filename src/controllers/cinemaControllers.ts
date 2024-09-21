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
    res.status(500).json({
      message: "Unable to locate any cinemas, please try again.",
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
    res.status(449).json({
      message:
        "Unable to locate the requested cinema. Please try again with a valid cinema ID.",
    });
  }
};

export const postACinema = async (req: Request, res: Response) => {
  try {
    req.body.owner = req.currentUser._id;
    const newCinemaDetails = req.body;

    const newCinema = await Cinema.create(newCinemaDetails);
    const newCinemaName = newCinema?.name;
    res.status(201).send(newCinema);
    console.log(`The requestor added ${newCinemaName} to Kino's cinema DB.`);
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to add a cinema to Kino's DB:",
      error
    );
    res.status(400).json({
      message: "Error posting cinema. Please reivew submitted details.",
    });
  }
};

export const removeACinema = async (req: Request, res: Response) => {
  try {
    const targetCinemaId = req.params.cinemaId;
    const targetCinema = await Cinema.findById(targetCinemaId);
    const targetCinemaOwner = targetCinema?.owner;
    if (req.currentUser._id.equals(targetCinemaOwner)) {
      const removedCinema = await Cinema.findByIdAndDelete(targetCinemaId);
      res
        .status(200)
        .json({ message: "The following cinema was removed:", removedCinema });
      console.log(`${removedCinema?.name} has been removed from Kino's DB`);
    } else {
      res.status(403).json({
        message:
          "Unauthorised request. Only the cinema owner can remove it from Kino Connection.",
      });
    }
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to remove a cinema from Kino's DB:",
      error
    );
    res.status(500).json({
      message: "An error occured when attempting to remove a cinema.",
    });
  }
};

export const updateACinema = async (req: Request, res: Response) => {
  try {
    const targetCinemaId = req.params.cinemaId;
    const targetCinema = await Cinema.findById(targetCinemaId);
    const targetCinemaOwner = targetCinema?.owner;
    if (req.currentUser._id.equals(targetCinemaOwner)) {
      const updatedInfo = req.body;
      const updatedCinema = await Cinema.findByIdAndUpdate(
        targetCinemaId,
        updatedInfo,
        { new: true }
      );
      res
        .status(200)
        .json({ message: "Cinema updated successfully", updatedCinema });
      console.log(`The requestor updated ${updatedCinema?.name} details.`);
    } else {
      res.status(403).json({
        message:
          "Unauthorised request. Only the cinema owner can update its details.",
      });
    }
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to update a cinema in Kino's DB:",
      error
    );
    res.status(500).json({
      message: "An error occured when attempting to update a cinema.",
    });
  }
};
