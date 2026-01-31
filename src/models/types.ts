import { Types } from "mongoose";

export interface ICountry {
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  name: string;
  country: Types.ObjectId;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date;
}
