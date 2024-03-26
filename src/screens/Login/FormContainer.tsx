import React from 'react';

export function FormContainer({
	testID,
	title,
	children,
	style,
}: {
	testID?: string;
	title?: React.ReactNode;
	children: React.ReactNode;
	style?: CSSStyleRule;
}) {
	return (
		<div>
			{title && <span>{title}</span>}
			{children}
		</div>
	);
}
