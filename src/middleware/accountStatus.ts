import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Cinema from "../models/cinema";
import Event from "../models/events";

import mongoose from "mongoose";

export const cinemaUserCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser.role !== "Cinema") {
    return res.status(403).json({
      message:
        "Access denied. Only cinema account holders can post a new Cinema to Kino Connection.",
    });
  }
  next();
};

export const eventOwnerOrHostCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hostCinemaId = req.params.cinemaId;
  const hostCinema = await Cinema.findById(hostCinemaId);
  const hostCinemaOwner = hostCinema?.owner._id;

  const targetEventId = req.params.eventId;
  const targetEvent = await Event.findById(targetEventId);

  if (!targetEvent) {
    return res.status(404).json({ message: "Event not found." });
  }

  const targetEventAuthor = targetEvent?.author._id;

  if (
    req.currentUser._id.equals(hostCinemaOwner) ||
    req.currentUser._id.equals(targetEventAuthor)
  ) {
    next();
  } else {
    return res.status(403).json({
      message:
        "Access denied. Only an event author or host can delete the content.",
    });
  }
};
