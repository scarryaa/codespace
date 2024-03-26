/* eslint-disable @typescript-eslint/no-empty-function */
import * as persisted from '../persisted';
import { AppLanguage } from '../../locale/languages';
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type SetStateCb = (s: persisted.Schema['languagePrefs']) => persisted.Schema['languagePrefs'];
type StateContext = persisted.Schema['languagePrefs'];
interface ApiContext {
	setPrimaryLanguage: (code2: string) => void;
	setAppLanguage: (code2: AppLanguage) => void;
}

const stateContext = createContext<StateContext>(persisted.defaults.languagePrefs);
const apiContext = createContext<ApiContext>({
	setPrimaryLanguage: () => {},
	setAppLanguage: () => {},
});

export const Provider = ({ children }: PropsWithChildren<object>) => {
	const [state, setState] = useState(persisted.get('languagePrefs'));

	const setStateWrapped = useCallback(
		(fn: SetStateCb) => {
			const s = fn(persisted.get('languagePrefs'));
			setState(s);
			persisted.write('languagePrefs', s);
		},
		[setState]
	);

	useEffect(() => {
		return persisted.onUpdate(() => {
			setState(persisted.get('languagePrefs'));
		});
	}, [setStateWrapped]);

	const api = useMemo(
		() => ({
			setPrimaryLanguage(code2: string) {
				setStateWrapped((s) => ({ ...s, primaryLanguage: code2 }));
			},
			setAppLanguage(code2: AppLanguage) {
				setStateWrapped((s) => ({ ...s, appLanguage: code2 }));
			},
		}),
		[state, setStateWrapped]
	);

	return (
		<stateContext.Provider value={state}>
			<apiContext.Provider value={api}>{children}</apiContext.Provider>
		</stateContext.Provider>
	);
};

export const useLanguagePrefs = () => {
	return useContext(stateContext);
};

export const useLanguagePrefsApi = () => {
	return useContext(apiContext);
};
