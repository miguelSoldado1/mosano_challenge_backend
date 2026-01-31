import { Router } from "express";
import { deleteCountry, getAllCountries, getCountries } from "../controllers/countryController";

const router = Router();

router.get("/", getCountries);
router.get("/all", getAllCountries);
router.delete("/:id", deleteCountry);

export default router;
