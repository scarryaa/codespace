import { Link } from 'react-router-dom';
import './Button.scss';
import { CommonButtonProps } from './types';

export const Button: React.FC<CommonButtonProps> = (props: CommonButtonProps) => {
	if (props.link) {
		return (
			<Link style={props.style} to={props.link} className={`button-link ${props.className ?? ''}`}>
				<button className="button" onClick={props.onClick}>
					{props.children ?? props.label}
				</button>
			</Link>
		);
	} else {
		return (
			<button style={props.style} className={`button ${props.className ?? ''}`} onClick={props.onClick}>
				{props.children ?? props.label}
			</button>
		);
	}
};
