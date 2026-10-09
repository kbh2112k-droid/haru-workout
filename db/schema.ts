import {index,integer,sqliteTable,text} from "drizzle-orm/sqlite-core";
export const workouts=sqliteTable("workouts",{id:text("id").primaryKey(),kind:text("kind").notNull(),date:text("date").notNull(),minutes:integer("minutes").notNull(),createdAt:text("created_at").notNull()},table=>[index("idx_workouts_date").on(table.date)]);
