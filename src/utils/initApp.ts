import { initDatabase } from "./db";
import migrateLocalDataToDb from "./migrateLocalData";

// Initialize the application
export const initApp = async () => {
  try {
    // Initialize the database schema
    await initDatabase();
    console.log("Database schema initialized successfully");

    // Migrate data from localStorage to database (if any)
    await migrateLocalDataToDb();

    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};

// Call this function when the app starts
export default initApp;
