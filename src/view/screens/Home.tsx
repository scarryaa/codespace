import { Hero } from '../../components/Hero/Hero';
import { HomeMetrics } from '../com/Home';

export const Home: React.FC = () => {
	return (
		<Hero title="develop with us" subtitle="Git hosting, powered by @atproto" ctaText="Sign up">
			<HomeMetrics />
		</Hero>
	);
};
