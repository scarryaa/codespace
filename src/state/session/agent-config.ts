/* eslint-disable @typescript-eslint/no-unsafe-return */
const PREFIX = 'agent-labelers';

export const saveLabelers = (did: string, value: string[]) => {
	localStorage.setItem(`${PREFIX}:${did}`, JSON.stringify(value));
};

// eslint-disable-next-line @typescript-eslint/require-await
export const readLabelers = async (did: string): Promise<string[] | undefined> => {
	const rawData = localStorage.getItem(`${PREFIX}:${did}`);
	return rawData ? JSON.parse(rawData) : undefined;
};
