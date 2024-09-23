import { Request, Response } from "express";
import mongoose from "mongoose";
import Cinema from "../models/cinema";
import Event from "../models/events";

export const getEventsForACinema = async (req: Request, res: Response) => {
  try {
    const requestedCinemaId = req.params.cinemaId;
    const obtainedCinema = await Cinema.findById(requestedCinemaId);
    const hostCinemaId = obtainedCinema?._id;
    const cinemaEvents = await Event.find({ location: hostCinemaId })
      .populate("location", "name address")
      .populate("author", "username");
    res.status(200).json({ cinemaEvents });
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

export const getAnEvent = async (req: Request, res: Response) => {
  try {
    const requestedEventId = req.params.eventId;
    const obtainedEvent = await Event.findById(requestedEventId);

    if (!obtainedEvent) {
      return res.status(404).json({
        message: "Event not found. Please try again with a valid event ID.",
      });
    }

    res.status(200).json(obtainedEvent);
    console.log("Event sent to user:", obtainedEvent);
  } catch (error) {
    console.error(
      "The following error occurred when the requestor tried to access a specific event:",
      error
    );
    res.status(500).json({
      message: "Unable to locate the requested event. Please try again later.",
    });
  }
};

export const postAnEvent = async (req: Request, res: Response) => {
  try {
    const requestedCinemaId = req.params.cinemaId;
    const obtainedCinema = await Cinema.findById(requestedCinemaId);
    const hostCinemaId = obtainedCinema?._id;

    req.body.author = req.currentUser._id;
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
    console.log(`${removedEvent?.title} was removed from DB`);
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to delete an event from Kino's DB:",
      error
    );
    res.status(500).json({
      message:
        "An error occured when attempting to delete the requested event. Please try again later.",
    });
  }
};

export const updateAnEvent = async (req: Request, res: Response) => {
  try {
    const targetEventId = req.params.eventId;
    const targetEvent = await Event.findById(targetEventId);
    const targetEventAuthor = targetEvent?.author;
    if (req.currentUser._id.equals(targetEventAuthor)) {
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
    } else {
      res.status(403).json({
        message:
          "Unauthorised request. Only the event author can update its details.",
      });
    }
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
