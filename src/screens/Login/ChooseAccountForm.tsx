import { useCallback } from 'react';
import { SessionAccount, useSession, useSessionApi } from '../../state/session';
import { useLoggedOutViewControls } from '../../view/shell/desktop/logged-out';
import { t } from '@lingui/macro';
import { FormContainer } from './FormContainer';
import { useProfileQuery } from '../../state/queries/profile';
import { Button } from '../../components/buttons/Button';
import './ChooseAccountForm.scss';

const AccountItem = ({
	account,
	onSelect,
	isCurrentAccount,
	top,
	bottom,
}: {
	account: SessionAccount;
	onSelect: (account: SessionAccount) => void;
	isCurrentAccount: boolean;
	top?: boolean;
	bottom?: boolean;
}) => {
	const { data: profile } = useProfileQuery({ did: account.did });

	const onPress = useCallback(() => {
		onSelect(account);
	}, [account, onSelect]);

	return (
		<div className="account-item">
			<Button
				style={
					top
						? { borderTopLeftRadius: 8, borderTopRightRadius: 8 }
						: bottom
							? { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }
							: {}
				}
				className="account-item-button"
				key={account.did}
				onClick={onPress}
			>
				<img src={profile?.avatar} className="account-avatar" />
				<span>
					{isCurrentAccount
						? t`Continue as` + account.handle + t`(currently signed in)`
						: t`Sign in as` + account.handle}
				</span>
			</Button>
		</div>
	);
};

export const ChooseAccountForm = ({ onSelectAccount }: { onSelectAccount: (account: SessionAccount) => void }) => {
	const { accounts, currentAccount } = useSession();
	const { initSession } = useSessionApi();
	const { setShowLoggedOut } = useLoggedOutViewControls();

	const onSelect = useCallback(
		(account: SessionAccount) => {
			if (account.accessJwt) {
				if (account.did === currentAccount?.did) {
					setShowLoggedOut(false);
					// show toast
				} else {
					void initSession(account);
					setTimeout(() => {
						//show toast
					}, 100);
				}
			} else {
				onSelectAccount(account);
			}
		},
		[currentAccount, initSession, onSelectAccount, setShowLoggedOut]
	);

	return (
		<FormContainer>
			<div className="accounts-container">
				{accounts.map((account, i) => (
					<AccountItem
						top={i === 0}
						bottom={i === accounts.length - 1}
						key={account.did}
						account={account}
						isCurrentAccount={account.did === currentAccount?.did}
						onSelect={onSelect}
					/>
				))}
			</div>
		</FormContainer>
	);
};
