import React, { FC } from 'react';

// Styles
import './Tag.scss';

interface ITagProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * A tag component is a small, interactive element used to label, categorize, and organize content within an interface. It can be used to highlight keywords, topics, or attributes related to an item. Tags enhance user navigation and search functionality by providing a quick way to filter and identify relevant information.
 */
const Tag: FC<ITagProps> = ({ size }) => {
    return <div className="tag">Tag</div>;
};

export { ITagProps, Tag as default };
