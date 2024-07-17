import React, { FC } from 'react';

// Styles
import './Pill.scss';

interface IPillProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * A Pill component used to display concise information or categorize content. Often used for labels or status indicators, Pill components are visually distinct and can convey different meanings through text and color coding.
 */
const Pill: FC<IPillProps> = ({ size }) => {
    return <div className="pill">Pill</div>;
};

export { IPillProps, Pill as default };
