import mongoose, { Schema, model, Types } from "mongoose";

interface IComment {
  content: string;
  event: Types.ObjectId;
  author: Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    content: { type: String, required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
