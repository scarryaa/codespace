import React, { CSSProperties } from 'react';
import './FormContainer.scss';

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
		<div className="form-container" style={style}>
			{title && <span>{title}</span>}
			{children}
		</div>
	);
}
