import { type Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./server/db/schema.ts",
  out: './db/migrations',
  driver: "mysql2",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["advisor_*"],
} satisfies Config;
