/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import './init';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { Provider as LoggedOutProvider } from './view/shell/desktop/logged-out';
import { Provider as SessionProvider } from './state/session/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider as DefaultI18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { messages as messagesEn } from './locale/locales/en/messages';

const queryClient = new QueryClient();
i18n.load({
	en: messagesEn,
});
i18n.activate('en');

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<DefaultI18nProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<LoggedOutProvider>
						<App />
					</LoggedOutProvider>
				</SessionProvider>
			</QueryClientProvider>
		</DefaultI18nProvider>
	</React.StrictMode>
);
