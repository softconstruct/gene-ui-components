import React, { FC } from "react";
import classNames from "classnames";

import { Download, RotateLeft, RotateRight } from "@geneui/icons";

// Styles
import "./Controllers.scss";

import { Button, ButtonGroup, Label, Switch } from "../../../../index";

interface IControllersProps {
    withOverlay?: boolean;
    className?: string;
    /**
     * Shows rotate controls in the footer.
     * @default true
     */
    showRotate?: boolean;
    /**
     * Callback fired when the rotate-right button is clicked.
     */
    onRotateRight?: () => void;
    /**
     * Callback fired when the rotate-left button is clicked.
     */
    onRotateLeft?: () => void;
    /**
     * Shows download control in the footer.
     * @default true
     */
    showDownload?: boolean;
    /**
     * Callback fired when the download button is clicked.
     */
    onDownload?: () => void;
}

/**
 * Image Preview component provides users with a detailed and enhanced view of an image. It’s commonly used in scenarios where users need to examine an image closely before taking an action.
 */
const Controllers: FC<IControllersProps> = ({
    withOverlay = false,
    className,
    showRotate = true,
    onRotateRight,
    onRotateLeft,
    showDownload = true,
    onDownload
}) => {
    return (
        <div
            className={classNames("controllers", className, {
                controllers__withOverlay: withOverlay
            })}
        >
            <Label text="Magnifier" labelFor="magnifierSwitcher" />
            <Switch id="magnifierSwitcher" />
            <ButtonGroup size="medium">
                {showRotate && (
                    <>
                        <Button
                            appearance="secondary"
                            layout="text"
                            Icon={RotateRight}
                            aria-label="Rotate right"
                            onClick={onRotateRight}
                        />
                        <Button
                            appearance="secondary"
                            layout="text"
                            Icon={RotateLeft}
                            aria-label="Rotate left"
                            onClick={onRotateLeft}
                        />
                    </>
                )}
                {showDownload && (
                    <Button
                        appearance="secondary"
                        layout="text"
                        Icon={Download}
                        aria-label="Download"
                        onClick={onDownload}
                    />
                )}
            </ButtonGroup>
        </div>
    );
};

export { IControllersProps, Controllers as default };
