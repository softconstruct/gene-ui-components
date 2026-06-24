import React, { FC, useState } from "react";
import classNames from "classnames";

import { Magnifier } from "@geneui/icons";

// Components
import { Popover, PopoverBody } from "@components/atoms/Popover";
import TextField from "@components/molecules/TextField";

// Styles
import "./SearchField.scss";

interface ISearchFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * Search Field component designed to facilitate the quick and efficient search of content within an application or website. It allows users to input search queries and retrieve relevant results based on their input.
 */
const SearchField: FC<ISearchFieldProps> = ({ className }) => {
    const [anchorProps, setAnchorProps] = useState<Record<string, unknown>>({});

    return (
        <div className={classNames("searchField", className)}>
            <div {...anchorProps} onKeyDown={undefined} className="searchField__anchor">
                <TextField placeholder="Search..." IconBefore={Magnifier} clearable />
            </div>
            <Popover setProps={setAnchorProps} fitReference trigger="click" withArrow={false} hasCloseButton={false}>
                <PopoverBody withPadding={false} withScrollbar={false} />
            </Popover>
        </div>
    );
};

export { ISearchFieldProps, SearchField as default };
