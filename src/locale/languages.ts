interface Language {
	code3: string;
	code2: string;
	name: string;
}

export enum AppLanguage {
	en = 'en',
}

interface AppLanguageConfig {
	code2: AppLanguage;
	name: string;
}

export const APP_LANGUAGES: AppLanguageConfig[] = [{ code2: AppLanguage.en, name: 'English' }];
export const LANGUAGES: Language[] = [{ code3: 'eng', code2: 'en', name: 'English' }];
