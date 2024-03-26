/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { useSessionApi } from '../../state/session';
import { ComAtprotoServerDescribeServer } from '@atproto/api';
import { logger } from '../../logger';
import { FormContainer } from './FormContainer';
import { t } from '@lingui/macro';
import { createFullHandle } from '../../lib/strings/handles';
type ServiceDescription = ComAtprotoServerDescribeServer.OutputSchema;

export const LoginForm = ({
	error,
	serviceUrl,
	serviceDescription,
	initialHandle,
	setError,
	// setServiceUrl,
	// onPressRetryConnect,
	onPressBack,
	onPressForgotPassword,
}: {
	error: string;
	serviceUrl: string;
	serviceDescription: ServiceDescription | undefined;
	initialHandle: string;
	setError: (v: string) => void;
	setServiceUrl: (v: string) => void;
	onPressRetryConnect: () => void;
	onPressBack: () => void;
	onPressForgotPassword: () => void;
}) => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [identifier, setIdentifier] = useState<string>(initialHandle);
	const [password, setPassword] = useState<string>('');
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const { login } = useSessionApi();

	const handleLogin = async () => {
		setIsProcessing(true);
		try {
			let fullIdent = identifier;
			if (
				!identifier.includes('@') && // not an email
				!identifier.includes('.') && // not a domain
				serviceDescription &&
				serviceDescription.availableUserDomains.length > 0
			) {
				let matched = false;
				for (const domain of serviceDescription.availableUserDomains) {
					if (fullIdent.endsWith(domain)) {
						matched = true;
					}
				}
				if (!matched) {
					fullIdent = createFullHandle(identifier, serviceDescription.availableUserDomains[0]);
				}
			}

			await login({ identifier, service: serviceUrl, password });
		} catch (error: any) {
			setError(error.message);
			logger.error(error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<FormContainer>
			<input
				type="text"
				value={identifier}
				onChange={(e) => {
					setIdentifier(e.target.value);
				}}
				placeholder={t({ message: 'HHello' })}
				disabled={isProcessing}
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => {
					setPassword(e.target.value);
				}}
				placeholder={t({ message: 'Password' })}
				ref={passwordInputRef}
				disabled={isProcessing}
			/>
			<button onClick={handleLogin}>
				{isProcessing ? t({ message: 'Logging In' }) : t({ message: 'Log in' })}
			</button>
			<button onClick={onPressForgotPassword} disabled={isProcessing}>
				{t({ message: 'Forgot password?' })}
			</button>
			<button onClick={onPressBack} disabled={isProcessing}>
				{t({ message: 'Back' })}
			</button>
			{error && <div>{error}</div>}
		</FormContainer>
	);
};

export default LoginForm;
