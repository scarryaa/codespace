import { Link } from 'react-router-dom';
import './Button.scss';
import { CommonButtonProps } from './types';

export const Button: React.FC<CommonButtonProps> = (props: CommonButtonProps) => {
	if (!props.link) {
		return <button className="button">{props.label}</button>;
	}

	return (
		<Link to={props.link}>
			<button className="button">{props.label}</button>
		</Link>
	);
};
