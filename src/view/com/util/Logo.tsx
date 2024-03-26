import { CSSProperties } from 'react';
import logoFull from '../../../../public/logo-full.png';

export const Logo = ({ className, style }: { className?: string; style?: CSSProperties }) => {
	return <img className={className} style={style} src={logoFull} />;
};
