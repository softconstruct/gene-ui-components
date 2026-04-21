import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./TransferList.scss";

interface ITransferListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TransferList component props interface
}

/**
 * Transfer List component enables users to move items between two or more lists, typically representing available and selected options.
 */
const TransferList: FC<ITransferListProps> = ({ className }) => {
    return <div className={classNames("transferList", className)}>TransferList</div>;
};

export { ITransferListProps, TransferList as default };
