export function IS_TEST_USER(handle?: string) {
	return handle?.endsWith('.test');
}
