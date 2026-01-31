import { model, Schema } from "mongoose";
import type { IUser } from "./types.js";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: Schema.Types.ObjectId, ref: "country", required: true },
    birthday: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const user = model<IUser>("user", userSchema, "user");
