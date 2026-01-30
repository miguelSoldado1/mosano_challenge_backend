import { Request, Response } from "express";
import { country } from "../models/country";

export async function getCountries(req: Request, res: Response) {
  try {
    const countries = await country.find().sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries from database" });
  }
}
