import { pgTable, index, unique, uuid, varchar, text, foreignKey, check, timestamp, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const appUser = pgTable("app_user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	login: varchar({ length: 255 }).notNull(),
	pswHash: text("psw_hash").notNull(),
	pswSalt: text("psw_salt").notNull(),
}, (table) => [
	index("app_user__login__idx").using("btree", table.login.asc().nullsLast().op("text_ops")),
	unique("app_user_login_key").on(table.login),
]);

export const appUserRole = pgTable("app_user_role", {
	userId: uuid("user_id").notNull(),
	roleValue: text("role_value").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleValue],
			foreignColumns: [appRole.value],
			name: "app_user_role_role_value_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [appUser.id],
			name: "app_user_role_user_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
]);

export const appRole = pgTable("app_role", {
	value: text().primaryKey().notNull(),
	info: text().notNull(),
});

export const appRound = pgTable("app_round", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	visibleAt: timestamp("visible_at", { withTimezone: true, mode: 'string' }).notNull(),
	startAt: timestamp("start_at", { withTimezone: true, mode: 'string' }).notNull(),
	endAt: timestamp("end_at", { withTimezone: true, mode: 'string' }).notNull(),
	statWinner: text("stat_winner"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	statWinnerScore: bigint("stat_winner_score", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	statTotalScore: bigint("stat_total_score", { mode: "number" }),
}, (table) => [
	index("app_round__visible_at__idx").using("btree", table.visibleAt.asc().nullsLast().op("timestamptz_ops")),
	check("app_round_check", sql`visible_at <= start_at`),
	check("app_round_check1", sql`start_at < end_at`),
]);

export const appUserTapEvent = pgTable("app_user_tap_event", {
	logTime: timestamp("log_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	roundId: uuid("round_id").notNull(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	index("app_user_tap_event__log_time__idx").using("btree", table.logTime.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.roundId],
			foreignColumns: [appRound.id],
			name: "app_user_tap_event_round_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [appUser.id],
			name: "app_user_tap_event_user_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
]);

export const appUserRoleDefault = pgTable("app_user_role_default", {
	login: text(),
	roleValue: text("role_value").notNull(),
}, (table) => [
	index("app_user_role_default__login__idx").using("btree", table.login.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.roleValue],
			foreignColumns: [appRole.value],
			name: "app_user_role_default_role_value_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
]);
