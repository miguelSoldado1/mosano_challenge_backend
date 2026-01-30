import connectDB from "../config/database";
import { country } from "../models/country";

interface RestCountry {
  name: { common: string };
  cca2: string;
}

const seedDatabase = async () => {
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

    const countriesToInsert = countriesData.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));

    await country.insertMany(countriesToInsert);

    console.log(`Database seeded successfully with ${countriesToInsert.length} countries from REST Countries API`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

void seedDatabase();
