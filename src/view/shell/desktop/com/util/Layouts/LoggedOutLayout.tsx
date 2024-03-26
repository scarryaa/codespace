import { PropsWithChildren } from 'react';
import { useWebMediaQueries } from '../../../../../../lib/hooks/useWebMediaQueries';

export const LoggedOutLayout = ({
	leadIn,
	title,
	description,
	children,
	scrollable,
}: PropsWithChildren<{ leadIn: string; title: string; description: string; scrollable?: boolean }>) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { isMobile } = useWebMediaQueries();

	if (isMobile) {
		if (scrollable) {
			return <div>{children}</div>;
		} else return <div>{children}</div>;
	}

	return (
		<div>
			<span>{leadIn}</span>
			<span>{title}</span>
			<span>{description}</span>
			<div>{children}</div>
		</div>
	);
};
