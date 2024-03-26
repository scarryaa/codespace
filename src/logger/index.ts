import { DebugContext } from './debugContext';
import * as env from '../env';

export enum LogLevel {
	Debug = 'debug',
	Info = 'info',
	Log = 'log',
	Warn = 'warn',
	Error = 'error',
}

export class Logger {
	LogLevel = LogLevel;
	DebugContext = DebugContext;

	enabled: boolean;
	level: LogLevel;

	protected debugContextRegexes: RegExp[] = [];

	constructor({
		enabled = !env.IS_TEST,
		level = env.LOG_LEVEL as LogLevel,
		debug = env.LOG_DEBUG || '',
	}: {
		enabled?: boolean;
		level?: LogLevel;
		debug?: string;
	} = {}) {
		this.enabled = enabled;
		this.level = debug ? LogLevel.Debug : level; // default to info
		this.debugContextRegexes = (debug || '').split(',').map((context) => {
			return new RegExp(context.replace(/[^\w:*]/, '').replace(/\*/g, '.*'));
		});
	}

	debug(message: string, metadata = {}, context?: string) {
		if (context && !this.debugContextRegexes.find((reg) => reg.test(context))) return;
		console.debug(message, metadata);
	}

	info(message: string, metadata = {}) {
		console.info(message, metadata);
	}

	log(message: string, metadata = {}) {
		console.log(message, metadata);
	}

	warn(message: string, metadata = {}) {
		console.warn(message, metadata);
	}

	error(error: Error | string, metadata = {}) {
		console.error(error, metadata);
	}
}

export const logger = new Logger();
