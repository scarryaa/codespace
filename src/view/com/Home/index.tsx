import './Home.scss';
import { t } from '@lingui/macro';
import { TextBlockWithHeading } from '../../../components/TextBlockWithHeading/TextBlockWithHeading';

export const HomeMetrics = () => {
	return (
		<div className="stats">
			<TextBlockWithHeading uppercase heading={t`Projects`} text={`0`} />
			<TextBlockWithHeading uppercase heading={t`Users`} text={`0`} />
		</div>
	);
};
