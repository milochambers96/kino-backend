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
  const targetEventOwner = targetEvent?.user._id;

  if (req.currentUser !== (hostCinemaOwner || targetEventOwner)) {
    return res.status(403).json({
      message:
        "Access denied. Only an event author or an event host can alter an event.",
    });
  }
  next();
};
