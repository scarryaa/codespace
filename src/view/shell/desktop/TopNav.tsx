import { useProfileQuery } from '../../../state/queries/profile';
import { useSession, useSessionApi } from '../../../state/session';
import './TopNav.scss';
import logo from '../../../../public/logo_icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from '@lingui/macro';
import { OutlineButton } from '../../../components/buttons/OutlineButton';
import { Button } from '../../../components/buttons/Button';
import { Dropdown, DropdownItem } from '../../com/util/forms/Dropdown';
import { faFileArchive, faUser } from '@fortawesome/free-regular-svg-icons';

const ProfileButton: React.FC = () => {
	const { currentAccount } = useSession();
	const { isLoading, data: profile } = useProfileQuery({ did: currentAccount?.did });
	const navigate = useNavigate();
	const { logout } = useSessionApi();

	const dropdownItems: DropdownItem[] = [
		{
			label: t`Profile`,
			icon: faUser,
			onPress: () => {
				navigate('/profile');
			},
		},
		{
			label: 'separator',
		},
		{
			label: t`Sign out`,
			icon: faFileArchive,
			onPress: async () => {
				await logout();
			},
		},
	];
	return !isLoading && profile ? (
		<Dropdown className="profile-dropdown" items={dropdownItems}>
			<img src={profile.avatar} className="top-nav__profile-button" alt={t`Profile`} />
		</Dropdown>
	) : (
		<div className="top-nav__placeholder">
			<Button link="/login" label={t`Sign in`} />
			<OutlineButton link="/sign-up" label={t`Sign up`} />
		</div>
	);
};

const LogoButton: React.FC = () => {
	return (
		<Link to={'/'} className="top-nav__logo-button">
			<img src={logo} className="top-nav__logo" alt="Logo" />
		</Link>
	);
};

export const TopNav: React.FC = () => {
	const location = useLocation();
	const [pageTitle, setPageTitle] = useState('');

	useEffect(() => {
		const path = location.pathname;
		const title = path === '/' ? t`Dashboard` : t`${path.substr(1)}`;
		setPageTitle(title);
	}, [location]);

	return (
		<div className="top-nav">
			<div className="top-nav__inner">
				<div className="top-nav__logo-title">
					<LogoButton />
					<span className="top-nav__page-title">{pageTitle}</span>
				</div>
				<ProfileButton />
			</div>
		</div>
	);
};
