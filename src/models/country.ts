import { model, Schema } from "mongoose";
import { ICountry } from "./types";

const countrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, minlength: 2, maxlength: 3, trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const country = model<ICountry>("country", countrySchema, "country");
