/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const cleanError = (str: any): string => {
	if (!str) {
		return '';
	}
	if (typeof str !== 'string') {
		str = str.toString();
	}
	if (isNetworkError(str)) {
		return 'Unable to connect. Please check your internet connection and try again.';
	}
	if (str.includes('Upstream Failure')) {
		return 'The server appears to be experiencing issues. Please try again in a few moments.';
	}
	if (str.startsWith('Error: ')) {
		return str.slice('Error: '.length);
	}
	return str;
};

export function isNetworkError(e: unknown) {
	const str = String(e);
	return str.includes('Abort') || str.includes('Network request failed') || str.includes('Failed to fetch');
}
