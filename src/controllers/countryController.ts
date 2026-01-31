import { fromNodeHeaders } from "better-auth/node";
import { Request, Response } from "express";
import z from "zod";
import { auth } from "../auth";
import { country } from "../models/country";

const countryIdSchema = z.object({
  id: z.string(),
});

const getCountriesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(["name", "createdAt", "updatedAt"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export async function getCountries(req: Request, res: Response) {
  try {
    const result = getCountriesSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const { page, limit, orderBy, order } = result.data;

    const skip = (page - 1) * limit;
    const sortDirection = order === "desc" ? -1 : 1;

    const [countries, total] = await Promise.all([
      country
        .find()
        .sort({ [orderBy]: sortDirection })
        .skip(skip)
        .limit(limit),
      country.countDocuments(),
    ]);

    res.json({ data: countries, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries from database" });
  }
}

export async function getAllCountries(req: Request, res: Response) {
  try {
    const countries = await country.find().sort({ name: 1 });
    res.json({ data: countries });
  } catch (error) {
    console.error("Error fetching all countries:", error);
    res.status(500).json({ error: "Failed to fetch countries from database" });
  }
}

export async function deleteCountry(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) {
      return res.status(401).json({ error: "You must be logged in to delete a user" });
    }

    const result = countryIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid country ID" });
    }

    const countryDoc = await country.findByIdAndDelete(result.data.id);
    if (!countryDoc) {
      return res.status(404).json({ error: "Country not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting country:", error);
    res.status(500).json({ error: "Failed to delete country" });
  }
}
