import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

// Components
import Button from "@components/atoms/Button";
import { Popover, PopoverBody, PopoverFooter } from "@components/atoms/Popover";
import Drawer from "@components/molecules/Drawer";
import TextField from "@components/molecules/TextField";

interface IFilterSaveConfig {
    /**
     * Text of the Save button.
     * @default "Save"
     */
    buttonText?: string;
    /**
     * Text of the save (confirm) button in the save popover.
     * @default "Save"
     */
    popoverSaveText?: string;
    /**
     * Text of the cancel button in the save popover.
     * @default "Cancel"
     */
    popoverCancelText?: string;
    /**
     * Label of the filter name field in the save popover.
     */
    popoverLabelText?: string;
    /**
     * Turns saving on: renders the Save button with its save popover. Without it the panel has no saving.
     * @default false
     */
    enabled?: boolean;
    /**
     * Disables the Save button.
     * @default false
     */
    buttonDisabled?: boolean;
    /**
     * Callback fired when the save popover is confirmed. Receives the filter name as typed by the user;
     * storing the current filter values under that name is up to the consumer.
     */
    onSave: (name: string) => void;
}

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
     * Text of the Apply button. The button is always rendered.
     * @default "Apply"
     */
    applyText?: string;
    /**
     * Text of the Reset button. The button is always rendered.
     * @default "Reset"
     */
    resetText?: string;
    /**
     * Disables the Apply button.
     */
    applyDisabled?: boolean;
    /**
     * Disables the Reset button.
     */
    resetDisabled?: boolean;
    /**
     * Configuration object for saving the filters.
     * Providing it with `enabled` set renders the Save button with its save popover;
     * otherwise the panel has no saving.
     */
    saveConfig?: IFilterSaveConfig;
    /**
     * Callback fired when the Apply button is clicked.
     */
    onApply?: () => void;
    /**
     * Callback fired when the Reset button is clicked.
     */
    onReset?: () => void;
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
    applyText = "Apply",
    resetText = "Reset",
    applyDisabled,
    resetDisabled,
    saveConfig,
    onApply,
    onReset,
    onClose
}) => {
    const {
        buttonText: saveButtonText = "Save",
        buttonDisabled: saveButtonDisabled,
        popoverSaveText: savePopoverSaveText = "Save",
        popoverCancelText: savePopoverCancelText = "Cancel",
        popoverLabelText: savePopoverLabelText,
        enabled: saveEnabled,
        onSave
    }: Partial<IFilterSaveConfig> = saveConfig || {};
    const [saveButtonProps, setSaveButtonProps] = useState({});
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [saveName, setSaveName] = useState("");
    // Stable ids: without them PopoverFooter generates new ones and remounts its buttons on every render
    const [saveActionId] = useState(() => `filter-save-${nanoid()}`);

    const closeSave = () => {
        setIsSaveOpen(false);
        setSaveName("");
    };

    useEffect(() => {
        if (!open || !saveEnabled) {
            closeSave();
            setSaveButtonProps({});
        }
    }, [open, saveEnabled]);

    const handleSave = () => {
        onSave?.(saveName);
        closeSave();
    };

    return (
        <Drawer
            className={classNames("filter", className)}
            open={open}
            title={title}
            hasCloseButton
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
                saveConfig &&
                saveEnabled && (
                    <>
                        <Button
                            {...saveButtonProps}
                            className="filter__save"
                            appearance="secondary"
                            disabled={saveButtonDisabled}
                            onClick={() => (isSaveOpen ? closeSave() : setIsSaveOpen(true))}
                        >
                            {saveButtonText}
                        </Button>
                        <Popover
                            open={isSaveOpen}
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
                            <PopoverFooter
                                actions={[
                                    {
                                        id: `${saveActionId}-cancel`,
                                        text: savePopoverCancelText,
                                        appearance: "secondary",
                                        onClick: closeSave
                                    },
                                    {
                                        id: `${saveActionId}-save`,
                                        text: savePopoverSaveText,
                                        disabled: !saveName,
                                        onClick: handleSave
                                    }
                                ]}
                            />
                        </Popover>
                    </>
                )
            }
        >
            {children}
        </Drawer>
    );
};

export { IFilterProps, IFilterSaveConfig, Filter as default };
