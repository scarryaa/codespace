import './init';
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopNav } from './view/shell/desktop/TopNav';
import { Login } from './screens/Login';
import { useEffect, useState } from 'react';
import * as persisted from './state/persisted';
import { init as initPersistedState } from './state/persisted';
import { useSession, useSessionApi } from './state/session';
import { Home } from './view/screens/Home';
import { NotFound } from './view/screens/NotFound';

const InnerApp: React.FC = () => {
	const { isInitialLoad, currentAccount } = useSession();
	const { resumeSession } = useSessionApi();

	useEffect(() => {
		const account = persisted.get('session').currentAccount;
		void resumeSession(account);
	}, [resumeSession]);

	if (isInitialLoad) return null;

	return (
		<Router key={currentAccount?.did}>
			<TopNav />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login onPressBack={() => {}} />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

function App() {
	const [isReady, setReady] = useState(false);

	useEffect(() => {
		const init = () => {
			initPersistedState();
			setReady(true);
		};

		init();
	}, []);

	if (!isReady) {
		return null;
	}

	return <InnerApp />;
}

export default App;
