/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMediaQuery } from 'react-responsive';
import { isNative } from '../../platform/detection';

export function useWebMediaQueries() {
	const isDesktop = useMediaQuery({ minWidth: 1300 });
	const isTablet = useMediaQuery({ minWidth: 800, maxWidth: 1300 - 1 });
	const isMobile = useMediaQuery({ maxWidth: 800 - 1 });
	const isTabletOrMobile = isMobile || isTablet;
	const isTabletOrDesktop = isDesktop || isTablet;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (isNative) {
		return {
			isMobile: true,
			isTablet: false,
			isTabletOrMobile: true,
			isTabletOrDesktop: false,
			isDesktop: false,
		};
	}
	return { isMobile, isTablet, isTabletOrMobile, isTabletOrDesktop, isDesktop };
}
