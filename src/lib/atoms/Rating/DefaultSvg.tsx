import * as React from 'react';

function SvgSquareMajor(props) {
    return React.createElement(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        },
        props,
        React.createElement('rect', {
            width: 18,
            height: 18,
            x: 3,
            y: 3,
            rx: 2
        })
    );
}

export default SvgSquareMajor;
