import { useProfileQuery } from '../../../state/queries/profile';
import { useSession } from '../../../state/session';
import './TopNav.scss';
import logo from '../../../../public/logo_icon.png';
import { Link } from 'react-router-dom';

const ProfileButton: React.FC = () => {
	const { currentAccount } = useSession();
	const { isLoading, data: profile } = useProfileQuery({ did: currentAccount?.did });
	return !isLoading && profile ? <img src={profile.avatar} className="profile-button" /> : <div>Placeholder</div>;
};

const LogoButton: React.FC = () => {
	return (
		<Link to={'/'}>
			<img src={logo} className="top-nav__logo" />
		</Link>
	);
};

export const TopNav: React.FC = () => {
	return (
		<div className="top-nav">
			<div className="top-nav__inner">
				<LogoButton />
				<ProfileButton />
			</div>
		</div>
	);
};
