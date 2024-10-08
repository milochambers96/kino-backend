import { model, Schema, Types } from "mongoose";

interface IEvent {
  title: string;
  location: Types.ObjectId;
  image: string;
  description: string;
  specificStartDate: Date;
  specificEndDate: Date;
  recurringDate: string;
  eventLink: string;
  author: Types.ObjectId;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Cinema", required: true },
    image: { type: String },
    description: { type: String, required: true },
    specificStartDate: { type: Date },
    specificEndDate: { type: Date },
    recurringDate: { type: String },

    eventLink: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Event = model<IEvent>("Event", eventSchema);

export default Event;
