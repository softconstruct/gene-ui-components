import React, { FC } from "react";
import classNames from "classnames";

import { Download, RotateLeft, RotateRight } from "@geneui/icons";

// Styles
import "./Controllers.scss";

import { Button, ButtonGroup, Label, Switch } from "../../../../index";

const controllerButtons = [
    { Icon: RotateRight, ariaLabel: "RotateRight" },
    { Icon: RotateLeft, ariaLabel: "RotateLeft" },
    { Icon: Download, ariaLabel: "Download" }
];

interface IControllersProps {
    withOverlay?: boolean;
    className?: string;
}

/**
 * Image Preview component provides users with a detailed and enhanced view of an image. It’s commonly used in scenarios where users need to examine an image closely before taking an action.
 */
const Controllers: FC<IControllersProps> = ({ withOverlay = false, className }) => {
    return (
        <div
            className={classNames("controllers", className, {
                controllers__withOverlay: withOverlay
            })}
        >
            <Label text="Magnifier" labelFor="magnifierSwitcher" />
            <Switch id="magnifierSwitcher" />
            <ButtonGroup size="medium">
                {controllerButtons.map(({ Icon, ariaLabel }) => (
                    <Button key={ariaLabel} appearance="secondary" layout="text" Icon={Icon} aria-label={ariaLabel} />
                ))}
            </ButtonGroup>
        </div>
    );
};

export { IControllersProps, Controllers as default };
