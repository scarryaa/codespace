/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import EventEmitter from 'eventemitter3';
import { Schema, defaults } from './schema';
import * as store from './store';

export type { Schema, PersistedAccount } from './schema';
export { defaults } from './schema';

let _state: Schema = defaults;
const _emitter = new EventEmitter();

export const init = () => {
	const stored = store.read();
	if (!stored) {
		store.write(defaults);
	}
	_state = stored || defaults;
};

export const get = <K extends keyof Schema>(key: K): Schema[K] => {
	return _state[key];
};

export const write = <K extends keyof Schema>(key: K, value: Schema[K]) => {
	_state[key] = value;
	store.write(_state);
};

export const onUpdate = (cb: () => void): (() => void) => {
	_emitter.addListener('update', cb);
	return () => _emitter.removeListener('update', cb);
};
