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
    return (
        <div className="tag tag_size_medium tag_state_rest tag_icon_false">
            {/* className={classNames("tag", className, { size })} */}
            {/* States - tag_state_rest // tag_state_error // tag_state_warning // tag_state_disabled */}
            {/* size - tag_size_medium  // tag_size_small */}
            {/* for icon add class // tag__icon */}
            <Icon />
            <p className="tag__text">{text}</p>
            <Button className="tag__button" Icon={Close} onClick={onClose} />
        </div>
    );
};

export { ITagProps, Tag as default };
