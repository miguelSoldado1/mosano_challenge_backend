import mongoose, { Schema } from "mongoose";
import { ICountry } from "../types.js";

const countrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, minlength: 2, maxlength: 3, trim: true },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  },
);

export const Country = mongoose.model<ICountry>("Country", countrySchema);
