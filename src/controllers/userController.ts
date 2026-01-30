import { Request, Response } from "express";
import z from "zod";
import { country } from "../models/country";
import { user } from "../models/user";

const userIdSchema = z.object({
  id: z.string(),
});

const createUserSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  surname: z.string().min(1).max(100).trim(),
  country: z.string().min(2).max(3).toUpperCase(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
});

export async function createUser(req: Request, res: Response) {
  try {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const countryDoc = await country.findOne({ code: result.data.country });
    if (!countryDoc) {
      return res.status(400).json({ error: "Invalid country code" });
    }

    const newUser = new user({ ...result.data, country: countryDoc._id });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

const getUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(["name", "surname", "createdAt", "updatedAt", "birthYear"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export async function getUsers(req: Request, res: Response) {
  try {
    const result = getUsersSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const { page, limit, orderBy, order } = result.data;
    const skip = (page - 1) * limit;
    const sortDirection = order === "desc" ? -1 : 1;

    const [users, total] = await Promise.all([
      user
        .find()
        .sort({ [orderBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .populate("country"),
      user.countDocuments(),
    ]);

    res.json({ data: users, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const result = userIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userDoc = await user.findById(result.data.id).populate("country");
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: userDoc });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

const updateUserSchema = createUserSchema.partial();

export async function updateUser(req: Request, res: Response) {
  try {
    const idResult = userIdSchema.safeParse(req.params);
    if (!idResult.success) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const bodyResult = updateUserSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const updateData: Record<string, unknown> = bodyResult.data;
    if (updateData.country) {
      const countryDoc = await country.findOne({ code: updateData.country }).select("_id");
      if (!countryDoc) {
        return res.status(400).json({ error: "Country code not found" });
      }

      updateData.country = countryDoc._id;
    }

    const updatedUser = await user
      .findByIdAndUpdate(idResult.data.id, { $set: updateData }, { new: true, runValidators: true })
      .populate("country");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const result = userIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await user.findByIdAndDelete(result.data.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}
