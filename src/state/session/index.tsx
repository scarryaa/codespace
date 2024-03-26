/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FC,
	PropsWithChildren,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import * as persisted from '../../state/persisted';
import AtpAgent, { AtpPersistSessionHandler, BskyAgent } from '@atproto/api';
import { networkRetry } from '../../lib/async/retry';
import { hasProp } from '../../lib/type-guards/type-guards';
import { jwtDecode } from 'jwt-decode';
import { PUBLIC_CODESTASH_AGENT } from '../../state/queries';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '../../logger';
import { IS_TEST_USER } from '../../lib/constants';
import { readLabelers } from './agent-config';
import { IS_DEV } from '../../env';
import { useLoggedOutViewControls } from '../../view/shell/desktop/logged-out';

export const CODESTASH_LABELER_DID = 'did:plc:ar7c4by46qjdydhdevvrndac';
let __globalAgent: AtpAgent = PUBLIC_CODESTASH_AGENT;
const __globalBskyAgent: BskyAgent = new BskyAgent({ service: 'https://public.api.bsky.app' });

export const getAgent = () => {
	return __globalAgent;
};

export const getBskyAgent = () => {
	return __globalBskyAgent;
};

export type SessionAccount = persisted.PersistedAccount;

export interface SessionState {
	isInitialLoad: boolean;
	isSwitchingAccounts: boolean;
	accounts: SessionAccount[];
	currentAccount: SessionAccount | undefined;
}

export type StateContext = SessionState & {
	hasSession: boolean;
};

export interface ApiContext {
	createAccount: (props: {
		service: string;
		email: string;
		password: string;
		handle: string;
		inviteCode?: string;
		verificationCode?: string;
	}) => Promise<void>;
	login: (props: { service: string; identifier: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
	initSession: (account: SessionAccount) => Promise<void>;
	resumeSession: (account?: SessionAccount) => Promise<void>;
	removeAccount: (account: SessionAccount) => void;
	selectAccount: (account: SessionAccount) => Promise<void>;
	updateCurrentAccount: (account: Partial<Pick<SessionAccount, 'handle' | 'email' | 'emailConfirmed'>>) => void;
	clearCurrentAccount: () => void;
}

const StateContext = createContext<StateContext>({
	isInitialLoad: true,
	isSwitchingAccounts: false,
	accounts: [],
	currentAccount: undefined,
	hasSession: false,
});

const ApiContext = createContext<ApiContext>({
	createAccount: async () => {},
	login: async () => {},
	logout: async () => {},
	initSession: async () => {},
	resumeSession: async () => {},
	removeAccount: () => {},
	selectAccount: async () => {},
	updateCurrentAccount: () => {},
	clearCurrentAccount: () => {},
});

const createPersistSessionHandler = (
	account: SessionAccount,
	persistSessionCallback: (props: { expired: boolean; refreshedAccount: SessionAccount }) => void,
	{
		networkErrorCallback,
	}: {
		networkErrorCallback?: () => void;
	} = {}
): AtpPersistSessionHandler => {
	return function persistSession(event, session) {
		const expired = event === 'expired' || event === 'create-failed';

		if (event === 'network-error') {
			networkErrorCallback?.();
			return;
		}

		const refreshedAccount: SessionAccount = {
			service: account.service,
			did: session?.did ?? account.did,
			handle: session?.handle ?? account.handle,
			email: session?.email ?? account.email,
			emailConfirmed: session?.emailConfirmed ?? account.emailConfirmed,
			deactivated: isSessionDeactivated(session?.accessJwt),
			refreshJwt: session?.refreshJwt,
			accessJwt: session?.accessJwt,
		};

		if (expired) {
			// drop session
		}

		persistSessionCallback({
			expired,
			refreshedAccount,
		});
	};
};

export const Provider: FC<PropsWithChildren<{ children: ReactNode }>> = ({ children }) => {
	const queryClient = useQueryClient();
	const isDirty = useRef(false);
	const [state, setState] = useState<SessionState>({
		isInitialLoad: true,
		isSwitchingAccounts: false,
		accounts: persisted.get('session').accounts,
		currentAccount: undefined,
	});

	const setStateAndPersist = useCallback(
		(fn: (prev: SessionState) => SessionState) => {
			isDirty.current = true;
			setState(fn);
		},
		[setState]
	);

	const upsertAccount = useCallback(
		(account: SessionAccount, expired = false) => {
			setStateAndPersist((s) => {
				return {
					...s,
					currentAccount: expired ? undefined : account,
					accounts: [account, ...s.accounts.filter((a) => a.did !== account.did)],
				};
			});
		},
		[setStateAndPersist]
	);

	const clearCurrentAccount = useCallback(() => {
		__globalAgent = PUBLIC_CODESTASH_AGENT;
		queryClient.clear();
		setStateAndPersist((s) => ({
			...s,
			currentAccount: undefined,
		}));
	}, [setStateAndPersist, queryClient]);

	const createAccount = useCallback<ApiContext['createAccount']>(
		async ({ service, email, password, handle, inviteCode, verificationPhone, verificationCode }: any) => {
			const agent = new AtpAgent({ service });

			await agent.createAccount({
				handle,
				password,
				email,
				inviteCode,
				verificationPhone,
				verificationCode,
			});

			if (!agent.session) {
				throw new Error('session: createAccount failed to establish a session.');
			}

			const deactivated = isSessionDeactivated(agent.session.accessJwt);
			if (!deactivated) {
				// do nothing
			}

			const account: SessionAccount = {
				service: agent.service.toString(),
				did: agent.session.did,
				handle: agent.session.handle,
				email: agent.session.email,
				emailConfirmed: false,
				refreshJwt: agent.session.refreshJwt,
				accessJwt: agent.session.accessJwt,
				deactivated,
			};

			await configureModeration(agent, account);

			agent.setPersistSessionHandler(
				createPersistSessionHandler(
					account,
					({ expired, refreshedAccount }) => {
						upsertAccount(refreshedAccount, expired);
					},
					{ networkErrorCallback: clearCurrentAccount }
				)
			);

			__globalAgent = agent;
			queryClient.clear();
			upsertAccount(account);
		},
		[upsertAccount, queryClient, clearCurrentAccount]
	);

	const login = useCallback<ApiContext['login']>(
		async ({ service, identifier, password }) => {
			logger.debug('session: login', {}, logger.DebugContext.session);

			const agent = new AtpAgent({ service });

			await agent.login({ identifier, password });

			if (!agent.session) {
				throw new Error('session: login failed to establish a session');
			}

			const account: SessionAccount = {
				service: agent.service.toString(),
				did: agent.session.did,
				handle: agent.session.handle,
				email: agent.session.email,
				emailConfirmed: agent.session.emailConfirmed ?? false,
				refreshJwt: agent.session.refreshJwt,
				accessJwt: agent.session.accessJwt,
				deactivated: isSessionDeactivated(agent.session.accessJwt),
			};

			await configureModeration(agent, account);

			agent.setPersistSessionHandler(
				createPersistSessionHandler(
					account,
					({ expired, refreshedAccount }) => {
						upsertAccount(refreshedAccount, expired);
					},
					{ networkErrorCallback: clearCurrentAccount }
				)
			);

			__globalAgent = agent;
			// @ts-expect-error we want to set this in dev
			if (IS_DEV) window.agent = agent;
			queryClient.clear();
			upsertAccount(account);

			logger.debug('session: logged in', {}, logger.DebugContext.session);
		},
		[upsertAccount, queryClient, clearCurrentAccount]
	);

	const logout = useCallback<ApiContext['logout']>((): any => {
		logger.debug(`session: logout`);
		clearCurrentAccount();
		setStateAndPersist((s) => {
			return {
				...s,
				accounts: s.accounts.map((a) => ({
					...a,
					refreshJwt: undefined,
					accessJwt: undefined,
				})),
			};
		});
	}, [clearCurrentAccount, setStateAndPersist]);

	const initSession = useCallback<ApiContext['initSession']>(
		async (account) => {
			logger.debug('session: initSession', {}, logger.DebugContext.session);

			const agent = new AtpAgent({
				service: account.service,
				persistSession: createPersistSessionHandler(
					account,
					({ expired, refreshedAccount }) => {
						upsertAccount(refreshedAccount, expired);
					},
					{ networkErrorCallback: clearCurrentAccount }
				),
			});
			// @ts-expect-error we want to set this in dev
			if (IS_DEV) window.agent = agent;
			await configureModeration(agent, account);

			let canReusePrevSession = false;
			try {
				if (account.accessJwt) {
					const decoded = jwtDecode(account.accessJwt);
					if (decoded.exp) {
						const didExpire = Date.now() >= decoded.exp * 1000;
						if (!didExpire) {
							canReusePrevSession = true;
						}
					}
				}
			} catch (e) {
				logger.error('session: could not decode jwt.');
			}

			const prevSession = {
				accessJwt: account.accessJwt ?? '',
				refreshJwt: account.refreshJwt ?? '',
				did: account.did,
				handle: account.handle,
				deactivated: isSessionDeactivated(account.accessJwt) || account.deactivated,
			};

			const resumeSessionWithFreshAccount = async (): Promise<SessionAccount> => {
				logger.debug('session: resumeSessionWithFreshAccount.');

				await networkRetry(1, () => agent.resumeSession(prevSession));

				if (!agent.session) {
					throw new Error('session: initSession failed to establish a session.');
				}

				return {
					service: agent.service.toString(),
					did: agent.session.did,
					handle: agent.session.handle,
					email: agent.session.email,
					emailConfirmed: agent.session.emailConfirmed ?? false,
					refreshJwt: agent.session.refreshJwt,
					accessJwt: agent.session.accessJwt,
					deactivated: isSessionDeactivated(agent.session.accessJwt),
				};
			};

			if (canReusePrevSession) {
				logger.debug('session: attempting to reuse previous session.');

				agent.session = prevSession;
				__globalAgent = agent;
				queryClient.clear();
				upsertAccount(account);

				if (prevSession.deactivated) {
					logger.debug('session: reusing session for deactivated account.');
					return;
				}

				resumeSessionWithFreshAccount()
					.then((freshAccount) => {
						if (JSON.stringify(account) !== JSON.stringify(freshAccount)) {
							logger.info('session: reuse of previous session returned a fresh account, upserting.');
							upsertAccount(freshAccount);
						}
					})
					.catch((e: unknown) => {
						logger.info('session: resumeSessionWithFreshAccount failed.', {
							message: e,
						});

						__globalAgent = PUBLIC_CODESTASH_AGENT;
					});
			} else {
				logger.debug('session: attempting to resume using previous session');

				try {
					const freshAccount = await resumeSessionWithFreshAccount();
					__globalAgent = agent;
					queryClient.clear();
					upsertAccount(freshAccount);
				} catch (e) {
					logger.info('session: resumeSessionWithFreshAccount failed.', {
						message: e,
					});

					__globalAgent = PUBLIC_CODESTASH_AGENT;
				}
			}
		},
		[upsertAccount, queryClient, clearCurrentAccount]
	);

	const resumeSession = useCallback<ApiContext['resumeSession']>(
		async (account) => {
			try {
				if (account) {
					await initSession(account);
				}
			} catch (e) {
				logger.error('session: resumeSession failed', { message: e });
			} finally {
				setState((s) => ({
					...s,
					isInitialLoad: false,
				}));
			}
		},
		[initSession]
	);

	const removeAccount = useCallback<ApiContext['removeAccount']>(
		(account) => {
			setStateAndPersist((s) => {
				return {
					...s,
					accounts: s.accounts.filter((a) => a.did !== account.did),
				};
			});
		},
		[setStateAndPersist]
	);

	const updateCurrentAccount = useCallback<ApiContext['updateCurrentAccount']>(
		(account) => {
			setStateAndPersist((s) => {
				const currentAccount = s.currentAccount;

				if (!currentAccount) return s;

				const updatedAccount = {
					...currentAccount,
					handle: account.handle ?? currentAccount.handle,
					email: account.email ?? currentAccount.email,
					emailConfirmed: account.emailConfirmed ?? currentAccount.emailConfirmed,
				};

				return {
					...s,
					currentAccount: updatedAccount,
					accounts: [updatedAccount, ...s.accounts.filter((a) => a.did !== currentAccount.did)],
				};
			});
		},
		[setStateAndPersist]
	);

	const selectAccount = useCallback<ApiContext['selectAccount']>(
		async (account) => {
			setState((s) => ({ ...s, isSwitchingAccounts: true }));

			try {
				await initSession(account);
				setState((s) => ({ ...s, isSwitchingAccounts: false }));
			} catch (e) {
				setState((s) => ({ ...s, isSwitchingAccounts: false }));

				throw e;
			}
		},
		[setState, initSession]
	);

	useEffect(() => {
		if (isDirty.current) {
			isDirty.current = false;
			persisted.write('session', {
				accounts: state.accounts,
				currentAccount: state.currentAccount,
			});
		}
	}, [state]);

	useEffect(() => {
		return persisted.onUpdate(() => {
			const session = persisted.get('session');

			logger.debug('session: persisted onUpdate', {});

			if (session.currentAccount?.refreshJwt) {
				if (session.currentAccount.did !== state.currentAccount?.did) {
					logger.debug('session: persisted onUpdate, switching accounts.', {
						from: {
							did: state.currentAccount?.did,
							handle: state.currentAccount?.handle,
						},
						to: {
							did: session.currentAccount.did,
							handle: session.currentAccount.handle,
						},
					});

					void initSession(session.currentAccount);
				} else {
					logger.debug('session: persisted onUpdate, updating session.', {});

					// @ts-expect-error we already checked for this
					__globalAgent.session = session.currentAccount;
				}
			} else if (!session.currentAccount && state.currentAccount) {
				logger.debug('session: persisted onUpdate, logging out.', {}, logger.DebugContext.session);

				clearCurrentAccount();
			}

			setState((s) => ({
				...s,
				accounts: session.accounts,
				currentAccount: session.currentAccount,
			}));
		});
	}, [state, setState, clearCurrentAccount, initSession]);

	const stateContext = useMemo(
		() => ({
			...state,
			hasSession: !!state.currentAccount,
		}),
		[state]
	);

	const api = useMemo(
		() => ({
			createAccount,
			login,
			logout,
			initSession,
			resumeSession,
			removeAccount,
			selectAccount,
			updateCurrentAccount,
			clearCurrentAccount,
		}),
		[
			createAccount,
			login,
			logout,
			initSession,
			resumeSession,
			removeAccount,
			selectAccount,
			updateCurrentAccount,
			clearCurrentAccount,
		]
	);

	return (
		<StateContext.Provider value={stateContext}>
			<ApiContext.Provider value={api}>{children}</ApiContext.Provider>
		</StateContext.Provider>
	);
};

const configureModeration = async (agent: AtpAgent, account: SessionAccount) => {
	if (IS_TEST_USER(account.handle)) {
		const did = (await agent.resolveHandle({ handle: 'mod-authority.test' }).catch(() => undefined))?.data.did;
		if (did) {
			console.warn('USING TEST ENV MODERATION');
			AtpAgent.configure({ appLabelers: [did] });
		}
	} else {
		AtpAgent.configure({ appLabelers: [CODESTASH_LABELER_DID] });
		const labelerDids = await readLabelers(account.did).catch(() => {});
		if (labelerDids) {
			agent.configureLabelersHeader(labelerDids.filter((did) => did !== CODESTASH_LABELER_DID));
		}
	}
};

export const useSession = () => {
	return useContext(StateContext);
};

export const useSessionApi = () => {
	return useContext(ApiContext);
};

export const useRequireAuth = () => {
	const { hasSession } = useSession();
	const { setShowLoggedOut } = useLoggedOutViewControls();

	return useCallback(
		(fn: () => void) => {
			if (hasSession) {
				fn();
			} else {
				setShowLoggedOut(true);
			}
		},
		[hasSession, setShowLoggedOut]
	);
};

export const isSessionDeactivated = (accessJwt: string | undefined) => {
	if (accessJwt) {
		const sessionData = jwtDecode(accessJwt);
		return hasProp(sessionData, 'scope') && sessionData.scope === 'com.atproto.deactivated';
	}
	return false;
};
