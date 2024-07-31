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
        <div className="tagTestHolder">
            <div className="tag tag_size_medium tag_state_rest tag_icon_false">
                <p className="tag__text">Tag</p>
                <button className="tag__button"></button>
            </div>

            <div className="tag tag_size_medium tag_state_error tag_icon_false">
                <p className="tag__text">Tag</p>
                <button className="tag__button"></button>
            </div>

            <div className="tag tag_size_medium tag_state_warning tag_icon_false">
                <p className="tag__text">Tag</p>
                <button className="tag__button"></button>
            </div>

            <div className="tag tag_size_medium tag_state_disabled tag_icon_false">
                <p className="tag__text">Tag</p>
                <button className="tag__button"></button>
            </div>
        </div>
    );
};

export { ITagProps, Tag as default };
