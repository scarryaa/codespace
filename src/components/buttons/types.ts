import { CSSProperties } from 'react';

export interface CommonButtonProps {
	label?: string;
	link?: string;
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	style?: CSSProperties;
}
