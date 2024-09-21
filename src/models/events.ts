import { model, Schema, Types } from "mongoose";

interface IEvent {
  title: string;
  location: Types.ObjectId;
  image: string;
  description: string;
  specificDate: Date;
  recurringDate: string;
  eventLink: string;
  user: Types.ObjectId;
  //   comments: []
}

const eventSchema: Schema<IEvent> = new Schema({
  title: { type: String, required: true },
  location: { type: Schema.Types.ObjectId, ref: "Cinema", required: true },
  image: { type: String },
  description: { type: String, required: true },
  specificDate: { type: Date },
  recurringDate: { type: String },
  eventLink: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  //   comments: {type: Array }
});

const Event = model<IEvent>("Event", eventSchema);

export default Event;
