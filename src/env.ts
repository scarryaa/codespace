export const IS_TEST = process.env.EXPO_PUBLIC_ENV === 'test';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const LOG_DEBUG = process.env.EXPO_PUBLIC_LOG_DEBUG ?? '';
export const LOG_LEVEL = process.env.EXPO_PUBLIC_LOG_LEVEL ?? 'info';
