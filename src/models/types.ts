import { Types } from "mongoose";

export interface ICountry {
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  name: string;
  surname: string;
  country: Types.ObjectId;
  birthYear: number;
  createdAt: Date;
  updatedAt: Date;
}
