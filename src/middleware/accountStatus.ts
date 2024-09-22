import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Cinema from "../models/cinema";
import Event from "../models/events";
import Comment from "../models/comments";

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

export const commentPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const associatedEventId = req.params.eventId;
  const associatedEvent = await Event.findById(associatedEventId);
  const associatedEventAuthor = associatedEvent?.author._id;

  const targetCommentId = req.params.commentId;
  const targetComment = await Comment.findById(targetCommentId);

  if (!targetComment) {
    return res.status(404).json({ message: "Comment not found." });
  }
  const targetCommentAuthor = targetComment?.author._id;

  if (
    req.currentUser._id.equals(associatedEventAuthor) ||
    req.currentUser._id.equals(targetCommentAuthor)
  ) {
    next();
  } else {
    return res.status(403).json({
      message:
        "Access denied. Only an event author or a comment author can remove the content.",
    });
  }
};
