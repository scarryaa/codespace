import { Link } from 'react-router-dom';
import './OutlineButton.scss';
import { CommonButtonProps } from './types';

export const OutlineButton: React.FC<CommonButtonProps> = (props: CommonButtonProps) => {
	if (props.link) {
		return (
			<Link style={props.style} to={props.link} className={`outline-button-link ${props.className ?? ''}`}>
				<button className="outline-button" onClick={props.onClick}>
					{props.children ?? props.label}
				</button>
			</Link>
		);
	} else {
		return (
			<button style={props.style} className={`outline-button ${props.className ?? ''}`} onClick={props.onClick}>
				{props.children ?? props.label}
			</button>
		);
	}
};
