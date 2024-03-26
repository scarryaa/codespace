import { i18n } from '@lingui/core';
import { AppLanguage } from './languages';
import { sanitizeAppLanguageSetting } from '../locale/helpers';
import { useEffect } from 'react';
import { useLanguagePrefs } from '../state/preferences';

export const dynamicActivate = async (locale: AppLanguage) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mod: any;

	switch (locale) {
		case AppLanguage.en: {
			mod = await import('./locales/en/messages');
			break;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	i18n.load(locale, mod.messages);
	i18n.activate(locale);
};

export const useLocaleLanguage = () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	const { appLanguage } = useLanguagePrefs();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const sanitizedLanguage = sanitizeAppLanguageSetting(appLanguage);

		document.documentElement.lang = sanitizedLanguage;
		void dynamicActivate(sanitizedLanguage);
	}, [appLanguage]);
};
