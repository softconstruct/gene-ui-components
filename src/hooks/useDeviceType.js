import { clientConfigs, mobileScreenSize } from 'configs';
import useWindowSize from './useWindowSize';

function useDeviceType(screenType) {
    const { width } = useWindowSize();

    const type =
        screenType ||
        (clientConfigs.isMobile
            ? clientConfigs.isMobile()
                ? 'mobile'
                : 'desktop'
            : width < mobileScreenSize
            ? 'mobile'
            : 'desktop');

    return { type, isMobile: type === 'mobile' };
}

export default useDeviceType;
