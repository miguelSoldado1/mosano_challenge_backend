import { model, Schema } from "mongoose";
import { IUser } from "./types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    country: { type: Schema.Types.ObjectId, ref: "country", required: true },
    birthYear: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
  },
  { timestamps: true, versionKey: false },
);

export const user = model<IUser>("user", userSchema);
