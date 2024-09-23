import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/comments";
import Event from "../models/events";

export const getCommentsForEvent = async (req: Request, res: Response) => {
  try {
    const requestedEventId = req.params.eventId;
    const obtainedEvent = await Event.findById(requestedEventId);

    if (!obtainedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const associatedEventId = obtainedEvent?._id;
    const eventComments = await Comment.find({
      event: associatedEventId,
    })
      .populate("event", "title")
      .populate("author", "username");
    res.status(200).json({ eventComments });
    console.log(
      `The following comments have been posted on ${obtainedEvent?.title} thread:`,
      eventComments
    );
  } catch (error) {
    console.error(
      `The following error occured when the requestor tried to find an events comments:`,
      error
    );
    res.status(500).json({
      message: "Unable to find any comments, please try again later.",
    });
  }
};

export const postAComment = async (req: Request, res: Response) => {
  try {
    const requestedEventId = req.params.commentId;
    const obtainedEvent = await Event.findById(requestedEventId);
    const associatedEventId = obtainedEvent?._id;

    req.body.author = req.currentUser._id;
    const newCommentDetails = req.body;
    const newComment = await Comment.create({
      ...newCommentDetails,
      event: associatedEventId,
    });
    const populatedNewComment = await Comment.findById(newComment._id)
      .populate("event", "title")
      .populate("author", "username");

    res.status(201).json({
      populatedNewComment,
    });
    console.log(`${populatedNewComment} was added to ${obtainedEvent?.title} `);
  } catch (error) {
    console.error(
      "The following error occured when the user tried to post a comment:",
      error
    );
    res.status(500).json({
      message: "Unable to post commnet, please try again later.",
    });
  }
};

export const deleteAComment = async (req: Request, res: Response) => {
  try {
    const targetCommentId = req.params.commentId;
    const deletedComment = await Comment.findByIdAndDelete(targetCommentId);
    res.status(200).json({
      message: "The following comment was removed from Kino's DB",
      deletedComment,
    });
    console.log(`${deletedComment} was removed from DB`);
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to remove a comment:",
      error
    );
    res.status(500).json({
      message:
        "An error occured when attempting to remove a comment. Please try again later.",
    });
  }
};

export const updateAComment = async (req: Request, res: Response) => {
  try {
    const targetCommentId = req.params.commentId;
    const targetComment = await Comment.findById(targetCommentId);
    const targetCommentAuthor = targetComment?.author;
    if (req.currentUser._id.equals(targetCommentAuthor)) {
      const updatedInfo = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(
        targetCommentId,
        updatedInfo,
        { new: true }
      );
    }
  } catch (error) {
    console.error(
      "The following error occured when the requestor tried to edit a comment:",
      error
    );
    res.status(500).json({
      message:
        "An error occured when attempting to update the requested comment. Please try again later.",
    });
  }
};
