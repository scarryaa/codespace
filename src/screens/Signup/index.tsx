import { t } from '@lingui/macro';
import { Logo } from '../../view/com/util/Logo';
import { LoggedOutLayout } from '../../view/shell/desktop/com/util/Layouts/LoggedOutLayout';
import { SignupForm } from './SignupForm';
import { useState } from 'react';

export const Signup = () => {
	const [error, setError] = useState<string>('');
	const [step, setStep] = useState<number>(1);

	const totalSteps = 2;
	const content = (
		<SignupForm maxSteps={totalSteps} setStep={setStep} step={step} error={error} setError={setError} />
	);
	const title = t({ message: 'Sign up' });
	const description = t({ message: `Step ${step.toString()} of ${totalSteps.toString()}` });

	return (
		<LoggedOutLayout
			style={{ maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
			leadIn={<Logo style={{ marginTop: 50, width: 200 }} />}
			title={title}
			description={description}
		>
			<div>{content}</div>
		</LoggedOutLayout>
	);
};
