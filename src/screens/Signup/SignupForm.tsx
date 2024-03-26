/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from 'react';
import { useSessionApi } from '../../state/session';
import { logger } from '../../logger';
import { FormContainer } from '../Login/FormContainer';
import { Button } from '../../components/buttons/Button';
import { t } from '@lingui/macro';
import './SignupForm.scss';
import { BSKY_SERVICE } from '../../lib/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';

const StepOne = ({
	email,
	isProcessing,
	setEmail,
	password,
	setPassword,
	service,
}: {
	email: string;
	isProcessing: boolean;
	password: string;
	setEmail: (v: string) => void;
	setPassword: (v: string) => void;
	service: string;
}) => {
	return (
		<>
			<label className="hosting-provider-label" htmlFor="hosting-provider">
				Hosting Provider
			</label>
			<input type="button" className="hosting-provider-field" id="hosting-provider" value={service} />
			<label className="email-label" htmlFor="email">
				Email
			</label>
			<input
				id="email"
				className="email-field"
				type="email"
				value={email}
				onChange={(e) => {
					setEmail(e.target.value);
				}}
				disabled={isProcessing}
			/>
			<label className="password-label" htmlFor="password">
				Password
			</label>
			<input
				className="password-field"
				type="password"
				id="password"
				value={password}
				onChange={(e) => {
					setPassword(e.target.value);
				}}
				disabled={isProcessing}
			/>
		</>
	);
};

const StepTwo = ({ userHandle, setUserHandle }: { userHandle: string; setUserHandle: (v: string) => void }) => {
	const [isValid, setIsValid] = useState<boolean>(true);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setUserHandle(value);
		setIsValid(/^[a-zA-Z0-9-]+$/.test(value));
	};

	return (
		<>
			<label className="user-handle-label" htmlFor="user-handle">
				{t`User handle`}
			</label>
			<input
				onChange={(e) => {
					handleChange(e);
				}}
				type="text"
				className="user-handle-field"
				id="user-handle"
				value={userHandle}
			/>
			<div className="full-handle">
				<span>{t`Your full handle will be`}</span>
				<span>{`@${userHandle}.bsky.social`}</span>
			</div>
			<div className="requirements">
				<FontAwesomeIcon
					className="requirements-icon"
					fontSize={16}
					icon={isValid ? faCheck : faClose}
					color={isValid ? 'var(--green)' : 'var(--red)'}
				/>
				<span>{`Only contains letters, numbers, and hyphens`}</span>
			</div>
			<div className="requirements">
				<FontAwesomeIcon
					className="requirements-icon"
					fontSize={16}
					color={userHandle.length >= 3 ? 'var(--green)' : 'var(--red)'}
					icon={userHandle.length >= 3 ? faCheck : faClose}
				/>
				<span>{`At least 3 characters`}</span>
			</div>
		</>
	);
};

export const SignupForm = ({
	error,
	setError,
	step,
	setStep,
	maxSteps,
}: {
	error: string;
	setError: (v: string) => void;
	step: number;
	setStep: (v: number) => void;
	maxSteps: number;
}) => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [service] = useState<string>(BSKY_SERVICE);
	const [userHandle, setUserHandle] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { createAccount } = useSessionApi();

	const handleSignup = async () => {
		setIsProcessing(true);
		try {
			await createAccount({ email, handle: `${userHandle}.bsky.social`, password, service });
		} catch (error: any) {
			setError(error.message);
			logger.error(error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<FormContainer
			style={{ backgroundColor: 'var(--secondary)', marginTop: '1rem', padding: '2rem 5rem', borderRadius: 8 }}
		>
			{step === 1 ? (
				<StepOne
					service={service}
					email={email}
					isProcessing={isProcessing}
					password={password}
					setPassword={setPassword}
					setEmail={setEmail}
				/>
			) : (
				<StepTwo setUserHandle={setUserHandle} userHandle={userHandle} />
			)}
			<Button
				className="signup-button"
				onClick={
					step === maxSteps
						? handleSignup
						: () => {
								setError('');
								setStep(step >= 1 ? ++step : step);
							}
				}
			>
				{step === maxSteps ? t`Sign up` : t`Next`}
			</Button>
			<Button
				className="back-button"
				onClick={() => {
					setError('');
					setStep(step > 1 ? --step : step);
				}}
			>
				{t`Back`}
			</Button>
			{error && <div className="error-message">{error}</div>}
		</FormContainer>
	);
};
