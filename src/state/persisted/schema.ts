import { z } from 'zod';
import { deviceLocales } from '../../platform/detection';

const accountSchema = z.object({
	service: z.string(),
	did: z.string(),
	handle: z.string(),
	email: z.string().optional(),
	emailConfirmed: z.boolean().optional(),
	refreshJwt: z.string().optional(),
	accessJwt: z.string().optional(),
	deactivated: z.boolean().optional(),
});

export type PersistedAccount = z.infer<typeof accountSchema>;

export const schema = z.object({
	colorMode: z.enum(['system', 'light', 'dim', 'dark']),
	session: z.object({
		accounts: z.array(accountSchema),
		currentAccount: accountSchema.optional(),
	}),
	onboarding: z.object({
		step: z.string(),
	}),
	languagePrefs: z.object({
		primaryLanguage: z.string(), // should move to server
		appLanguage: z.string(),
	}),
});

export const defaults: Schema = {
	colorMode: 'system',
	onboarding: {
		step: 'Home',
	},
	session: {
		accounts: [],
		currentAccount: undefined,
	},
	languagePrefs: {
		primaryLanguage: deviceLocales[0] || 'en',
		appLanguage: deviceLocales[0] || 'en',
	},
};
export type Schema = z.infer<typeof schema>;
