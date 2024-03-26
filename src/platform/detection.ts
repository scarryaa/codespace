export const isNative = false;
export const devicePlatform = 'web';
export const isWeb = !isNative;
export const isMobileWebMediaQuery = 'only screen and (max-width: 1300px)';
export const isMobileWeb = global.window.matchMedia(isMobileWebMediaQuery).matches;

export const deviceLocales = navigator.language;
