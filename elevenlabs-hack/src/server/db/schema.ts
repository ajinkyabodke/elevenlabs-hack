// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `elevenlabs-hack_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk user id
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  memory: text("memory")
    .array()
    .notNull()
    .$type<string[]>()
    // empty array as default
    .default(sql`ARRAY[]::text[]`),

  memoryEnabledAt: timestamp("memoryEnabledAt", {
    withTimezone: true,
  }).defaultNow(),
});

export const journalEntries = createTable(
  "journal_entry",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rawEntry: text("raw_entry").notNull(), // Original user input
    summarizedEntry: text("summarized_entry").notNull(), // AI-generated summary
    moodScore: decimal("mood_score", { precision: 5, scale: 2 }).notNull(), // Score between 0-100
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    createdAtIndex: index("created_at_idx").on(table.createdAt),
    userIdIndex: index("user_id_idx").on(table.userId),
  }),
);
