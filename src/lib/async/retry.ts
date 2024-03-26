/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isNetworkError } from '../strings/errors';

export const retry = async <P>(retries: number, cond: (err: any) => boolean, fn: () => Promise<P>): Promise<P> => {
	let lastErr;
	while (retries > 0) {
		try {
			return await fn();
		} catch (e: any) {
			lastErr = e;
			if (cond(e)) {
				retries--;
				continue;
			}
			throw e;
		}
	}
	throw lastErr;
};

export async function networkRetry<P>(retries: number, fn: () => Promise<P>): Promise<P> {
	return retry(retries, isNetworkError, fn);
}
