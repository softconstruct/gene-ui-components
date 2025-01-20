import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./TagGroup.scss";

interface ITagGroupProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TagGroup component props interface
}

/**
 * Tag Group displays a list of selected options, offering a clear and organized way to present chosen items.
 */
const TagGroup: FC<ITagGroupProps> = ({ className }) => {
    return <div className={classNames("tagGroup", className)}>TagGroup</div>;
};

export { ITagGroupProps, TagGroup as default };
