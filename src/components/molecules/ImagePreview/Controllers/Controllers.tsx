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
     * Shows magnifier switch in the footer.
     * @default true
     */
    withMagnifier?: boolean;
    /**
     * Controls magnifier switch checked state.
     */
    magnifierChecked?: boolean;
    /**
     * Callback fired when magnifier switch value changes.
     */
    onMagnifierChange?: (checked: boolean) => void;
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
    withMagnifier = true,
    magnifierChecked = false,
    onMagnifierChange,
    showRotate = true,
    onRotateRight,
    onRotateLeft,
    showDownload = true,
    onDownload
}) => {
    const hasButtonActions = showRotate || showDownload;
    const hasMagnifierControl = withMagnifier;
    const hasVisibleContent = hasMagnifierControl || hasButtonActions;

    if (!hasVisibleContent) {
        return null;
    }

    return (
        <div
            className={classNames("controllers", className, {
                controllers__withOverlay: withOverlay,
                controllers_magnifierOnly: hasMagnifierControl && !hasButtonActions
            })}
        >
            {hasMagnifierControl && (
                <div className="controllers__magnifier">
                    <Label text="Magnifier" labelFor="magnifierSwitcher" />
                    <Switch
                        id="magnifierSwitcher"
                        checked={magnifierChecked}
                        onChange={(event) => onMagnifierChange?.(event.currentTarget.checked)}
                    />
                </div>
            )}
            {hasButtonActions && (
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
            )}
        </div>
    );
};

export { IControllersProps, Controllers as default };
