CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`date` text NOT NULL,
	`minutes` integer NOT NULL,
	`created_at` text NOT NULL
);

--> statement-breakpoint
CREATE INDEX `idx_workouts_date` ON `workouts` (`date`);