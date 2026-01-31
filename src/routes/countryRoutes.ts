import { Router } from "express";
import { getAllCountries, getCountries } from "../controllers/countryController";

const router = Router();

router.get("/", getCountries);
router.get("/all", getAllCountries);

export default router;
