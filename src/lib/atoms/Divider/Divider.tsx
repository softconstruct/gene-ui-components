import React, { FC } from 'react';

// Styles
import './Divider.scss';

interface IDividerProps {
    /**
     * type description
     */
    type?: unknown;
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */
const Divider: FC<IDividerProps> = ({ type }) => {
    return <div className="divider">Divider</div>;
};

export { IDividerProps, Divider as default };
