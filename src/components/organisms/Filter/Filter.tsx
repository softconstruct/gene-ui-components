import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";

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
     * Disables the Save button.
     * @default false
     */
    buttonDisabled?: boolean;
    /**
     * Shows the loading state of the Save button.
     * @default false
     */
    buttonLoading?: boolean;
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
     * Providing it renders the Save button with its save popover;
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
    const [saveButtonProps, setSaveButtonProps] = useState({});
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [saveName, setSaveName] = useState("");

    const closeSave = () => {
        setIsSaveOpen(false);
        setSaveName("");
    };

    useEffect(() => {
        if (!open) {
            closeSave();
            setSaveButtonProps({});
        }
    }, [open]);

    const renderSaveSection = ({
        buttonText = "Save",
        buttonDisabled,
        buttonLoading,
        popoverSaveText = "Save",
        popoverCancelText = "Cancel",
        popoverLabelText,
        onSave
    }: IFilterSaveConfig) => (
        <>
            <Button
                {...saveButtonProps}
                className="filter__save"
                appearance="secondary"
                disabled={buttonDisabled}
                loading={buttonLoading}
                onClick={() => (isSaveOpen ? closeSave() : setIsSaveOpen(true))}
            >
                {buttonText}
            </Button>
            <Popover
                open={isSaveOpen}
                position={document.dir === "rtl" ? "top-right" : "top-left"}
                withArrow={false}
                setProps={setSaveButtonProps}
                onClose={closeSave}
                mobileHeightMode="fit"
            >
                <PopoverBody withScrollbar={false}>
                    <TextField
                        size="large"
                        label={popoverLabelText}
                        value={saveName}
                        required
                        autoFocus
                        autoComplete="off"
                        onChange={(event) => setSaveName(event.target.value)}
                    />
                </PopoverBody>
                <PopoverFooter
                    actions={[
                        {
                            id: "filter-save-cancel",
                            text: popoverCancelText,
                            appearance: "secondary",
                            onClick: closeSave
                        },
                        {
                            id: "filter-save-submit",
                            text: popoverSaveText,
                            disabled: !saveName,
                            onClick: () => {
                                onSave(saveName);
                                closeSave();
                            }
                        }
                    ]}
                />
            </Popover>
        </>
    );

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
            footerSwappable={saveConfig && renderSaveSection(saveConfig)}
        >
            {children}
        </Drawer>
    );
};

export { IFilterProps, IFilterSaveConfig, Filter as default };
