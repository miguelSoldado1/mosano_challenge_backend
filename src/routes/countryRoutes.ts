import { Router } from "express";
import { createCountry, deleteCountry, getAllCountries, getCountries } from "../controllers/countryController.js";

const router = Router();

router.get("/", getCountries);
router.get("/all", getAllCountries);
router.post("/", createCountry);
router.delete("/:id", deleteCountry);

export default router;
