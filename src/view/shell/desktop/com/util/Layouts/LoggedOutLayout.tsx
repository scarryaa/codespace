import { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { useWebMediaQueries } from '../../../../../../lib/hooks/useWebMediaQueries';
import './LoggedOutLayout.scss';

export const LoggedOutLayout = ({
	leadIn,
	title,
	description,
	children,
	scrollable,
	style,
}: PropsWithChildren<{
	leadIn: ReactNode;
	title: string;
	description: string;
	scrollable?: boolean;
	style?: CSSProperties;
}>) => {
	const { isMobile } = useWebMediaQueries();

	if (isMobile) {
		if (scrollable) {
			return <div>{children}</div>;
		} else return <div>{children}</div>;
	}

	return (
		<div className="logged-out-layout">
			{leadIn}
			<span className="title">{title}</span>
			<span className="description">{description}</span>
			{children}
		</div>
	);
};
