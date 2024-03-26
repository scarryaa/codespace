import { ReactNode } from 'react';
import './Hero.scss';
import { Button } from '../buttons/Button';

export const Hero = ({
	backgroundImage,
	title,
	subtitle,
	ctaText,
	children,
}: {
	backgroundImage?: string;
	title: string;
	subtitle: ReactNode | string;
	ctaText: string;
	children?: ReactNode;
}) => {
	return (
		<div className="hero" style={{ backgroundImage: `url(${backgroundImage ?? ''})` }}>
			<h1 className="hero-title">{title}</h1>
			<p className="hero-subtitle">{subtitle}</p>
			<Button className="hero-cta-button">{ctaText}</Button>
			{children}
		</div>
	);
};
