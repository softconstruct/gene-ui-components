import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./SegmentedControl.scss";
// import {ArrowBigLeft} from "lucide-react";
import { TagOutline } from "@geneui/icons";
import { HelperText, Label } from "../../../index";

interface ISegmentedControlProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill SegmentedControl component props interface
}

const SegmentedControl: FC<ISegmentedControlProps> = ({ className }) => {
    return (
        <div className={classNames("segmentedControl", className)}>
            <Label labelText="Label" required />
            <div className="segmentedControl__wrapper">
                <button
                    type="button"
                    className="segmentedControl__block segmentedControl__block_size_large segmentedControl__block_icon_before segmentedControl__block_selected"
                >
                    <TagOutline />
                    <span className="segmentedControl__text">Button</span>
                </button>
                <button
                    type="button"
                    className="segmentedControl__block segmentedControl__block_size_large segmentedControl__block_icon_before"
                >
                    <span className="segmentedControl__text">Button</span>
                </button>
                <button type="button" className="segmentedControl__block segmentedControl__block_size_large">
                    <TagOutline />
                    <span className="segmentedControl__text">Button</span>
                </button>
                <button type="button" className="segmentedControl__block segmentedControl__block_size_large">
                    <span className="segmentedControl__text">Button</span>
                </button>
                <button
                    type="button"
                    className="segmentedControl__block segmentedControl__block_size_large segmentedControl__block_icon_after segmentedControl__block_selected"
                    disabled
                >
                    <TagOutline />
                    <span className="segmentedControl__text">Button</span>
                </button>
            </div>
            <HelperText text="Helper text" />
        </div>
    );
};

export { ISegmentedControlProps, SegmentedControl as default };
