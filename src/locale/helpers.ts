import { AppLanguage } from './languages';

export const sanitizeAppLanguageSetting = (appLanguage: string): AppLanguage => {
	const langs = appLanguage.split(',').filter(Boolean);

	for (const lang of langs) {
		switch (lang) {
			case 'en':
				return AppLanguage.en;
			default:
				continue;
		}
	}
	return AppLanguage.en;
};
