import { PropsWithChildren } from 'react';
import { Provider as LanguagesProvider } from './languages';
export { useLanguagePrefs, useLanguagePrefsApi } from './languages';

export const Provider = ({ children }: PropsWithChildren<object>) => {
	return <LanguagesProvider>{children}</LanguagesProvider>;
};
