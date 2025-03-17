// This file is now deprecated. All database operations should go through the API.
// Keeping this file for backward compatibility, but it's no longer used for database operations.

import { neonConfig } from "../api/neon";

// Define types for our database client
interface DbQueryResult {
  rows: Record<string, unknown>[];
  rowCount?: number;
}

interface DbClient {
  query: (text: string, params?: unknown[]) => Promise<DbQueryResult>;
}

// Create a mock client that logs warnings and tells developers to use the API
export const createNeonClient = (): DbClient => {
  console.warn(
    "⚠️ Direct database access deprecated! Use the API endpoints instead."
  );
  console.log(
    "The backend API is now handling all database operations at http://localhost:8080/api"
  );

  return {
    query: async (
      text: string,
      params: unknown[] = []
    ): Promise<DbQueryResult> => {
      console.warn(
        "⚠️ Attempted to use deprecated direct database access! Please use the API endpoints instead."
      );
      console.log("Query:", text);
      console.log("Parameters:", params);
      return { rows: [], rowCount: 0 };
    },
  };
};

// Create a singleton instance
const db = createNeonClient();

// Helper function that's now a no-op
export const initDatabase = async () => {
  console.warn(
    "⚠️ initDatabase is deprecated! Database schema is now managed by the backend API."
  );
};

export default db;
