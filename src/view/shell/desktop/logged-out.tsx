import React from 'react';

interface State {
	showLoggedOut: boolean;
	requestedAccountSwitchTo?: string;
}

interface Controls {
	setShowLoggedOut: (show: boolean) => void;
	requestSwitchToAccount: (props: { requestedAccount?: string }) => void;
	clearRequestedAccount: () => void;
}

const StateContext = React.createContext<State>({
	showLoggedOut: false,
	requestedAccountSwitchTo: undefined,
});

const ControlsContext = React.createContext<Controls>({
	setShowLoggedOut: () => {},
	requestSwitchToAccount: () => {},
	clearRequestedAccount: () => {},
});

export function Provider({ children }: React.PropsWithChildren<object>) {
	const [state, setState] = React.useState<State>({
		showLoggedOut: false,
		requestedAccountSwitchTo: undefined,
	});

	const controls = React.useMemo<Controls>(
		() => ({
			setShowLoggedOut(show) {
				setState((s) => ({
					...s,
					showLoggedOut: show,
				}));
			},
			requestSwitchToAccount({ requestedAccount }) {
				setState((s) => ({
					...s,
					showLoggedOut: true,
					requestedAccountSwitchTo: requestedAccount,
				}));
			},
			clearRequestedAccount() {
				setState((s) => ({
					...s,
					requestedAccountSwitchTo: undefined,
				}));
			},
		}),
		[setState]
	);

	return (
		<StateContext.Provider value={state}>
			<ControlsContext.Provider value={controls}>{children}</ControlsContext.Provider>
		</StateContext.Provider>
	);
}

export function useLoggedOutView() {
	return React.useContext(StateContext);
}

export function useLoggedOutViewControls() {
	return React.useContext(ControlsContext);
}
