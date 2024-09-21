import { Request, Response } from "express";
import mongoose from "mongoose";
import Cinema from "../models/cinema";
import Event from "../models/events";

export const getEventsForACinema = async (req: Request, res: Response) => {
  try {
    const requestedCinemaId = req.params.cinemaId;
    const obtainedCinema = await Cinema.findById(requestedCinemaId);
    const hostCinemaId = obtainedCinema?._id;
    const cinemaEvents = await Event.find({ location: hostCinemaId }).populate(
      "location",
      "name address"
    );
    res
      .status(200)
      .json({ hostCinema: obtainedCinema?.name, events: cinemaEvents });
    console.log(
      `${obtainedCinema?.name} is hosting the following events:`,
      cinemaEvents
    );
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to find all events:",
      error
    );
    res.status(500).json({
      message: "Unable to find any events, please try again.",
    });
  }
};

export const postAnEvent = async (req: Request, res: Response) => {
  try {
    const requestedCinemaId = req.params.cinemaId;
    const obtainedCinema = await Cinema.findById(requestedCinemaId);
    const hostCinemaId = obtainedCinema?._id;

    const newEventDetails = req.body;
    const newEvent = await Event.create({
      ...newEventDetails,
      location: hostCinemaId,
    });
    const populatedEvent = await Event.findById(newEvent._id).populate(
      "location",
      "name address"
    );

    res.status(201).json({
      message: `The following event was added to ${obtainedCinema?.name}`,
      event: populatedEvent,
    });
    console.log(
      `${obtainedCinema?.name} is hosting the newly added event:`,
      newEvent
    );
  } catch (error) {
    console.error(
      "The following error occured when the user tried to create a event:",
      error
    );
    res.status(500).json({
      message: "Unable to create event, please try again.",
    });
  }
};

export const deleteAnEvent = async (req: Request, res: Response) => {
  try {
    const cinemaId = req.params.cinemaId;
    const targetEventId = req.params.eventId;
    const removedEvent = await Event.findByIdAndDelete(targetEventId);
    res.status(200).json({
      message: "The following event was removed from Kino's DB",
      removedEvent,
    });
    console.log(`${removedEvent?.title} was remvoed from DB`);
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to delete an event from Kino's DB:",
      error
    );
    res.status(500).json({
      message:
        "An error occured when attempting to delete the requested event.",
    });
  }
};

export const updateAnEvent = async (req: Request, res: Response) => {
  try {
    const targetEventId = req.params.eventId;
    const updatedInfo = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      targetEventId,
      updatedInfo,
      { new: true }
    );
    res.status(200).json({
      message: `${updatedEvent?.title} was successfully updated`,
      event: updatedEvent,
    });
    console.log(`The requestor updated ${updatedEvent?.title}'s details.`);
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to update an event in Kino's DB:",
      error
    );
    res.status(500).json({
      message:
        "An error occured when attempting to update the requested event.",
    });
  }
};
