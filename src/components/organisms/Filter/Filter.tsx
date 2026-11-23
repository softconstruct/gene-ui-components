import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";

// Components
import Button from "@components/atoms/Button";
import { Popover, PopoverBody, PopoverFooter } from "@components/atoms/Popover";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Drawer from "@components/molecules/Drawer";
import TextField from "@components/molecules/TextField";

// Styles
import "./Filter.scss";

interface IFilterProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Controls the visibility of the Filter panel.
     */
    open?: boolean;
    /**
     * The title text displayed in the panel header.
     */
    title?: string;
    /**
     * The filter fields. Their values are owned by the consumer.
     */
    children?: ReactNode;
    /**
     * Text of the Apply button. The button is not rendered without it.
     */
    applyText?: string;
    /**
     * Text of the Reset button. The button is not rendered without it.
     */
    resetText?: string;
    /**
     * Text of the Save button. The button is not rendered without it.
     */
    saveText?: string;
    /**
     * Text of the save (confirm) button in the save popover. The button is not rendered without it.
     */
    savePopoverSaveText?: string;
    /**
     * Text of the cancel button in the save popover. The button is not rendered without it.
     */
    savePopoverCancelText?: string;
    /**
     * Label of the filter name field in the save popover.
     */
    savePopoverLabelText?: string;
    /**
     * Disables the Apply button.
     */
    applyDisabled?: boolean;
    /**
     * Disables the Reset button.
     */
    resetDisabled?: boolean;
    /**
     * Disables the Save button and the confirm button in the save popover.
     */
    saveDisabled?: boolean;
    /**
     * Callback fired when the Apply button is clicked.
     */
    onApply?: () => void;
    /**
     * Callback fired when the Reset button is clicked.
     */
    onReset?: () => void;
    /**
     * Callback fired when the save popover is confirmed. Receives the trimmed filter name typed by the user;
     * storing the current filter values under that name is up to the consumer.
     */
    onSave?: (name: string) => void;
    /**
     * Callback fired when the panel is requested to be closed (close button, Escape key or overlay click).
     */
    onClose?: () => void;
}

/**
 * Filter is a Drawer panel that groups a page's filter fields and lets users apply, reset and save them.
 */
const Filter: FC<IFilterProps> = ({
    className,
    open,
    title,
    children,
    applyText,
    resetText,
    saveText,
    savePopoverSaveText,
    savePopoverCancelText,
    savePopoverLabelText,
    applyDisabled,
    resetDisabled,
    saveDisabled,
    onApply,
    onReset,
    onSave,
    onClose
}) => {
    const [saveButtonProps, setSaveButtonProps] = useState({});
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [saveName, setSaveName] = useState("");
    const trimmedSaveName = saveName.trim();

    const closeSave = () => {
        setIsSaveOpen(false);
        setSaveName("");
    };

    // The save button and popover unmount with the panel, so their state must not survive until the next open
    useEffect(() => {
        if (!open) {
            closeSave();
            setSaveButtonProps({});
        }
    }, [open]);

    const handleSave = () => {
        onSave?.(trimmedSaveName);
        closeSave();
    };

    return (
        <Drawer
            className={classNames("filter", className)}
            open={open}
            title={title}
            hasCloseButton
            // Escape closes the save popover first, not the whole panel
            shouldCloseOnEscapePress={!isSaveOpen}
            onClose={onClose}
            actions={[
                {
                    children: resetText,
                    appearance: "secondary",
                    layout: "text",
                    disabled: resetDisabled,
                    onClick: onReset
                },
                { children: applyText, disabled: applyDisabled, onClick: onApply }
            ]}
            footerSwappable={
                saveText && (
                    <>
                        <Button
                            {...saveButtonProps}
                            className="filter__save"
                            appearance="secondary"
                            disabled={saveDisabled}
                            onClick={() => (isSaveOpen ? closeSave() : setIsSaveOpen(true))}
                        >
                            {saveText}
                        </Button>
                        <Popover
                            open={isSaveOpen}
                            // `atoms/Popover` ignores RTL, so the side is picked here
                            position={document.dir === "rtl" ? "top-right" : "top-left"}
                            withArrow={false}
                            setProps={setSaveButtonProps}
                            onClose={closeSave}
                        >
                            <PopoverBody withScrollbar={false}>
                                <TextField
                                    size="large"
                                    label={savePopoverLabelText}
                                    value={saveName}
                                    required
                                    autoFocus
                                    onChange={(event) => setSaveName(event.target.value)}
                                />
                            </PopoverBody>
                            <PopoverFooter>
                                <ButtonGroup className="filter__saveActions" size="small">
                                    {savePopoverCancelText && (
                                        <Button appearance="secondary" layout="text" onClick={closeSave}>
                                            {savePopoverCancelText}
                                        </Button>
                                    )}
                                    {savePopoverSaveText && (
                                        <Button disabled={saveDisabled || !trimmedSaveName} onClick={handleSave}>
                                            {savePopoverSaveText}
                                        </Button>
                                    )}
                                </ButtonGroup>
                            </PopoverFooter>
                        </Popover>
                    </>
                )
            }
        >
            {children}
        </Drawer>
    );
};

export { IFilterProps, Filter as default };
