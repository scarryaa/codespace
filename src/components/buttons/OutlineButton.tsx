import { Link } from 'react-router-dom';
import './OutlineButton.scss';
import { CommonButtonProps } from './types';

export const OutlineButton: React.FC<CommonButtonProps> = (props: CommonButtonProps) => {
	if (!props.link) {
		return <button className="outline-button">{props.label}</button>;
	}

	return (
		<Link to={props.link}>
			<button className="outline-button">{props.label}</button>
		</Link>
	);
};
