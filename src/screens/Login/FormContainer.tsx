import React, { CSSProperties } from 'react';

export function FormContainer({
	title,
	children,
	style,
}: {
	testID?: string;
	title?: React.ReactNode;
	children: React.ReactNode;
	style?: CSSProperties;
}) {
	return (
		<div style={style}>
			{title && <span>{title}</span>}
			{children}
		</div>
	);
}
