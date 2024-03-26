import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { Provider as LoggedOutProvider } from './view/shell/desktop/logged-out.tsx';
import { Provider as SessionProvider } from './state/session/index.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<LoggedOutProvider>
					<App />
				</LoggedOutProvider>
			</SessionProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
