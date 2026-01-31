import connectDB from "../config/database.js";
import { country } from "../models/country.js";

interface RestCountry {
  name: { common: string };
  cca2: string;
}

async function seedDatabase() {
  try {
    await connectDB();

    const existingCountries = await country.countDocuments();
    if (existingCountries > 0) {
      console.log("Database already seeded with countries");
      process.exit(0);
    }

    console.log("Fetching countries from REST Countries API...");

    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const countriesData = (await response.json()) as RestCountry[];

    // Shuffle the array and take the first 100 countries
    const shuffledCountries = countriesData.sort(() => Math.random() - 0.5).slice(0, 100);

    const countriesToInsert = shuffledCountries.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));

    await country.insertMany(countriesToInsert);

    console.log(`Database seeded successfully with 100 random countries from REST Countries API`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

void seedDatabase();
