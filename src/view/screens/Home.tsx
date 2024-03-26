import { Hero } from '../../components/Hero/Hero';
import { HomeMetrics } from '../com/Home';

export const Home: React.FC = () => {
	return (
		<Hero
			title="develop with us"
			subtitle={
				<span>
					Git hosting, powered by <a href={'https://atproto.com/'}>@atproto</a>
				</span>
			}
			ctaText="Sign up"
		>
			<HomeMetrics />
		</Hero>
	);
};
