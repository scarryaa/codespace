import { CSSProperties } from 'react';
import './CenteredView.scss';

export const CenteredView = ({ children, style }: { children: React.ReactNode; style?: CSSProperties }) => {
	return (
		<div className="centered-view" style={style}>
			{children}
		</div>
	);
};
