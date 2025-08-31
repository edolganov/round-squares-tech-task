import { relations } from "drizzle-orm/relations";
import { appRole, appUserRole, appUser, appRound, appUserTapEvent, appUserRoleDefault } from "./schema";

export const appUserRoleRelations = relations(appUserRole, ({one}) => ({
	appRole: one(appRole, {
		fields: [appUserRole.roleValue],
		references: [appRole.value]
	}),
	appUser: one(appUser, {
		fields: [appUserRole.userId],
		references: [appUser.id]
	}),
}));

export const appRoleRelations = relations(appRole, ({many}) => ({
	appUserRoles: many(appUserRole),
	appUserRoleDefaults: many(appUserRoleDefault),
}));

export const appUserRelations = relations(appUser, ({many}) => ({
	appUserRoles: many(appUserRole),
	appUserTapEvents: many(appUserTapEvent),
}));

export const appUserTapEventRelations = relations(appUserTapEvent, ({one}) => ({
	appRound: one(appRound, {
		fields: [appUserTapEvent.roundId],
		references: [appRound.id]
	}),
	appUser: one(appUser, {
		fields: [appUserTapEvent.userId],
		references: [appUser.id]
	}),
}));

export const appRoundRelations = relations(appRound, ({many}) => ({
	appUserTapEvents: many(appUserTapEvent),
}));

export const appUserRoleDefaultRelations = relations(appUserRoleDefault, ({one}) => ({
	appRole: one(appRole, {
		fields: [appUserRoleDefault.roleValue],
		references: [appRole.value]
	}),
}));