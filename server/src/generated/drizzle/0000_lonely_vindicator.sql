-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "app_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"login" varchar(255) NOT NULL,
	"psw_hash" text NOT NULL,
	"psw_salt" text NOT NULL,
	CONSTRAINT "app_user_login_key" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "app_user_role" (
	"user_id" uuid NOT NULL,
	"role_value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_role" (
	"value" text PRIMARY KEY NOT NULL,
	"info" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_round" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	CONSTRAINT "app_round_check" CHECK (end_at = start_at)
);
--> statement-breakpoint
CREATE TABLE "app_user_tap_event" (
	"log_time" timestamp with time zone DEFAULT now() NOT NULL,
	"round_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_user_role" ADD CONSTRAINT "app_user_role_role_value_fkey" FOREIGN KEY ("role_value") REFERENCES "public"."app_role"("value") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "app_user_role" ADD CONSTRAINT "app_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "app_user_tap_event" ADD CONSTRAINT "app_user_tap_event_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "public"."app_round"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "app_user_tap_event" ADD CONSTRAINT "app_user_tap_event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX "app_user__login__idx" ON "app_user" USING btree ("login" text_ops);
*/