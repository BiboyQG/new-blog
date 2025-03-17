// This file has been updated to reflect our new API architecture.
// The frontend now connects to a Go backend API, which handles
// all database operations with the Neon PostgreSQL database.

// The API server runs on http://localhost:8080/api by default.

export const neonConfig = {
  // This is no longer used directly by the frontend, but keeping for reference
  connectionString: import.meta.env.VITE_NEON_DATABASE_URL,

  // The base URL for the API
  apiBaseUrl: "http://localhost:8080/api",
};

// Import this in your actual API implementation files
