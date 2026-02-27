import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./AutoComplete.scss";

interface IAutoCompleteProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill AutoComplete component props interface
}

/**
 * Autocomplete component enhances input fields by providing real-time suggestions as the user types. As users begin entering text, a list of potential matches is dynamically generated, allowing them to quickly select from these options instead of typing the entire input manually.
 */
const AutoComplete: FC<IAutoCompleteProps> = ({ className }) => {
    return <div className={classNames("autoComplete", className)}>AutoComplete</div>;
};

export { IAutoCompleteProps, AutoComplete as default };
