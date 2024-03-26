export function IS_TEST_USER(handle?: string) {
	return handle?.endsWith('.test');
}

export const BSKY_SERVICE = 'https://bsky.social';
export const CODESTASH_SERVICE = 'https://codestash.social';
export const DEFAULT_SERVICE = BSKY_SERVICE;
