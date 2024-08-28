/* Recognizing screen size by configuration.
 * Now we have 5 supported screen sizes.
 */

const getPartsByWindowSize = (size, options) => {
    let screenKey = 'xxl';
    let screenSize = options[screenKey];

    for (const key in options) {
        const value = options[key];
        // find value closest to our window size
        if (size <= value && value < screenSize) {
            screenKey = key;
            screenSize = value;
        }
    }
    return screenKey;
};

export { getPartsByWindowSize };
