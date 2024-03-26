import { useState } from 'react';
import './TextBlockWithHeading.scss';

export const TextBlockWithHeading = ({
	heading,
	text,
	uppercase,
}: {
	heading: string;
	text: string;
	uppercase?: boolean;
}) => {
	const [_heading] = useState<string>(uppercase ? heading.toUpperCase() : heading);

	return (
		<div className="text-block">
			<h2 className="heading">{_heading}</h2>
			<span className="text">{text}</span>
		</div>
	);
};
