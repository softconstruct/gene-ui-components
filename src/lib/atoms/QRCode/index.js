import React from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';

const QRConfig = {
    levels: {
        L: 'L',
        M: 'M',
        Q: 'Q',
        H: 'H'
    }
};

function QRCode({ value, level, maxSize }) {
    return (
        <QRCodeSVG
            value={value}
            size={maxSize}
            bgColor="rgba(255,255,255,0)"
            fgColor="rgba(var(--background-sc-rgb), 1)"
            level={level}
            includeMargin={false}
        />
    );
}

QRCode.propTypes = {
    /**
     * If you'd like to apply styles to the single container div that your popover content is rendered within via stylesheets
     */
    value: PropTypes.string.isRequired,
    /**
     * Specifies the maximum size of QRCode component in pixels.
     * The component behaves adaptively and listens to the parent wrapper.
     */
    maxSize: PropTypes.number,
    /**
     * Level L (Low)	7% of data bytes can be restored.
     * Level M (Medium)	15% of data bytes can be restored.
     * Level Q (Quartile)[76]	25% of data bytes can be restored.
     * Level H (High)	30% of data bytes can be restored.
     */
    level: PropTypes.oneOf(Object.keys(QRConfig.levels))
};

QRCode.defaultProps = {
    maxSize: 400,
    level: QRConfig.levels.M
};

export default QRCode;
