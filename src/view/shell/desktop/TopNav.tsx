import { useProfileQuery } from '../../../state/queries/profile';
import { useSession } from '../../../state/session';
import './TopNav.scss';

const ProfileButton: React.FC = () => {
	const { currentAccount } = useSession();
	const { isLoading, data: profile } = useProfileQuery({ did: currentAccount?.did });
	return !isLoading && profile ? <img src={profile.avatar} className="profile-button" /> : <div>Placeholder</div>;
};

export const TopNav: React.FC = () => {
	return (
		<div className="top-nav">
			<div className="top-nav__inner">
				<div className="logo">logo</div>
				<ProfileButton />
			</div>
		</div>
	);
};
