import React, { FC } from "react";
import classNames from "classnames";

// styles
import "./SegmentedControl.scss";

// types
import { IGlobalProps } from "./types";

const Control: FC<IGlobalProps> = ({
    children,
    name,
    Icon,
    size = "medium",
    iconBefore = true,
    disabled = false,
    isSelected = false
}) => {
    return (
        <button
            name={name}
            type="button"
            className={classNames(`segmentedControl__block segmentedControl__block_size_${size}`, {
                segmentedControl__block_icon_before: Icon && children && iconBefore,
                segmentedControl__block_icon_after: Icon && children && !iconBefore,
                segmentedControl__block_icon_only: Icon && !children,
                segmentedControl__block_selected: isSelected
            })}
            disabled={disabled}
        >
            {Icon && <Icon />}
            {children && <span className="segmentedControl__text">{children}</span>}
        </button>
    );
};

export default Control;
