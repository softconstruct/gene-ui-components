import * as React from 'react';

var SvgStarMajor = function SvgStarMajor(props) {
    return React.createElement(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            className: 'lucide lucide-star'
        },
        props,
        React.createElement('path', {
            d: 'm12 2 3.09 6.26 6.91 1.01-5 4.87 1.18 6.88-6.18-3.25-6.18 3.25 1.18-6.88-5-4.87 6.91-1.01 3.09-6.26z'
        })
    );
};

export default SvgStarMajor;
