import { Request, Response } from "express";
import z from "zod";
import { country } from "../models/country";

const getCountriesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
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
