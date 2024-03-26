import { z } from 'zod';

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
};
export type Schema = z.infer<typeof schema>;
