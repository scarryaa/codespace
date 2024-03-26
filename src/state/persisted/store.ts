/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Schema, schema } from './schema';

const CODESTASH_STORAGE = 'CODESTASH_STORAGE';

export const write = (value: Schema) => {
	schema.parse(value);
	localStorage.setItem(CODESTASH_STORAGE, JSON.stringify(value));
};

export const read = () => {
	const rawData = localStorage.getItem(CODESTASH_STORAGE);
	const objData = rawData ? JSON.parse(rawData) : undefined;
	if (schema.safeParse(objData).success) {
		return objData;
	}
};

export const clear = () => {
	localStorage.removeItem(CODESTASH_STORAGE);
};
