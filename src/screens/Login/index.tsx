import { useEffect, useState } from 'react';
import { SessionAccount, useSession } from '../../state/session';
import { useLoggedOutView } from '../../view/shell/desktop/logged-out';
import { BSKY_SERVICE } from '../../lib/constants';
import { useServiceQuery } from '../../state/queries/service';
import { logger } from '../../logger';
import LoginForm from './LoginForm';
import { LoggedOutLayout } from '../../view/shell/desktop/com/util/Layouts/LoggedOutLayout';
import { t } from '@lingui/macro';
import { ChooseAccountForm } from './ChooseAccountForm';
import { Logo } from '../../view/com/util/Logo';

enum Forms {
	Login,
	ChooseAccount,
	ForgotPassword,
	SetNewPassword,
	PasswordUpdated,
}

export const Login = ({ onPressBack }: { onPressBack: () => void }) => {
	const { accounts } = useSession();
	const { requestedAccountSwitchTo } = useLoggedOutView();
	const requestedAccount = accounts.find((acc) => acc.did === requestedAccountSwitchTo);
	const [error, setError] = useState<string>('');
	const [serviceUrl, setServiceUrl] = useState<string>(requestedAccount?.service ?? BSKY_SERVICE);
	const [initialHandle, setInitialHandle] = useState<string>(requestedAccount?.handle ?? '');
	const [currentForm, setCurrentForm] = useState<Forms>(
		requestedAccount ? Forms.Login : accounts.length ? Forms.ChooseAccount : Forms.Login
	);
	const { data: serviceDescription, error: serviceError, refetch: refetchService } = useServiceQuery(serviceUrl);

	const onSelectAccount = (account?: SessionAccount) => {
		if (account?.service) {
			setServiceUrl(account.service);
		}
		setInitialHandle(account?.handle ?? '');
		setCurrentForm(Forms.Login);
	};

	const gotoForm = (form: Forms) => {
		setError('');
		setCurrentForm(form);
	};

	useEffect(() => {
		if (serviceError) {
			setError(t`Unable to contact your service. Please check your Internet connection.`);
			logger.warn(`Failed to fetch service description for ${serviceUrl}`, {
				error: String(serviceError),
			});
		} else {
			setError('');
		}
	}, [serviceError, serviceUrl]);

	const onPressForgotPassword = () => {
		setCurrentForm(Forms.ForgotPassword);
	};

	let content = null;
	let title = '';
	let description = '';

	switch (currentForm) {
		case Forms.Login:
			title = t`Sign in`;
			description = t`Enter your username and password`;
			content = (
				<LoginForm
					error={error}
					serviceUrl={serviceUrl}
					serviceDescription={serviceDescription}
					initialHandle={initialHandle}
					setError={setError}
					setServiceUrl={setServiceUrl}
					onPressBack={() =>
						accounts.length
							? () => {
									gotoForm(Forms.ChooseAccount);
								}
							: () => {
									onPressBack();
								}
					}
					onPressForgotPassword={onPressForgotPassword}
					onPressRetryConnect={() => refetchService}
				/>
			);
			break;
		case Forms.ChooseAccount:
			title = t`Sign in to CodeStash`;
			description = t`Select from an existing account`;
			content = <ChooseAccountForm onSelectAccount={onSelectAccount} />;
			break;
	}

	return (
		<LoggedOutLayout
			style={{ maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
			leadIn={<Logo style={{ marginTop: 50, width: 200 }} />}
			title={title}
			description={description}
			scrollable
		>
			<div key={currentForm}>{content}</div>
		</LoggedOutLayout>
	);
};
