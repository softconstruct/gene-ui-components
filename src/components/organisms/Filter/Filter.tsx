import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";

import { Save } from "@geneui/icons";

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
     * Text of the Saved Filters button in the panel header.
     * @default "Saved Filters"
     */
    savedFiltersText?: string;
    /**
     * Callback fired when the Saved Filters button is clicked. Providing it renders the button in the panel header;
     * showing the saved filters is up to the consumer.
     */
    onSavedFiltersClick?: () => void;
    /**
     * Whether the save popover is open.
     * The popover is owned by the consumer: open it from `onPopoverOpenChange` and, once the save succeeded,
     * close it from `onSave`. A rejected save must leave it open, so the user keeps the typed name.
     */
    popoverOpen: boolean;
    /**
     * Callback fired when the save popover requests to open or close
     * (Save button, cancel button, Escape key, outside click, panel close). Confirming the save does not fire it.
     */
    onPopoverOpenChange: (open: boolean) => void;
    /**
     * Whether a save is in progress.
     * Disables the filter name field and the cancel button, runs the loading state of the save (confirm) button
     * and keeps the save from being confirmed again.
     * @default false
     */
    popoverSaveLoading?: boolean;
    /**
     * Callback fired when the save popover is confirmed. Receives the filter name as typed by the user;
     * storing the current filter values under that name is up to the consumer.
     * The panel reports the confirm and nothing more: keeping `popoverSaveLoading` on while the save runs,
     * and turning `popoverOpen` off once it succeeded, is the consumer's.
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
     * Providing it renders the Save button with its save popover, and the Saved Filters button
     * when `onSavedFiltersClick` is set; otherwise the panel has no saving.
     * The save popover and the save state are owned by the consumer, since only the consumer knows whether
     * the save succeeded.
     * @example
     * saveConfig={{
     *   popoverOpen: isSaveOpen,
     *   popoverSaveLoading: isSaving,
     *   onPopoverOpenChange: setIsSaveOpen,
     *   onSave: async (name) => {
     *     setIsSaving(true);
     *     try {
     *       await api.saveFilter(name, values);
     *       setIsSaveOpen(false);
     *     } finally {
     *       setIsSaving(false);
     *     }
     *   }
     * }}
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
    const [saveName, setSaveName] = useState("");

    const isSavePopoverOpen = !!saveConfig?.popoverOpen;

    useEffect(() => {
        if (open && saveConfig) return;
        if (saveConfig?.popoverOpen) saveConfig.onPopoverOpenChange(false);
        setSaveButtonProps({});
    }, [open, saveConfig]);

    useEffect(() => {
        if (!isSavePopoverOpen) setSaveName("");
    }, [isSavePopoverOpen]);

    const renderSavedFiltersButton = ({
        savedFiltersText = "Saved Filters",
        onSavedFiltersClick
    }: Pick<IFilterSaveConfig, "savedFiltersText" | "onSavedFiltersClick">) =>
        onSavedFiltersClick && (
            <Button
                Icon={Save}
                iconPosition="before"
                appearance="secondary"
                layout="text"
                onClick={onSavedFiltersClick}
            >
                {savedFiltersText}
            </Button>
        );

    const renderSaveSection = ({
        buttonText = "Save",
        buttonDisabled,
        buttonLoading,
        popoverSaveText = "Save",
        popoverCancelText = "Cancel",
        popoverLabelText,
        popoverOpen,
        popoverSaveLoading,
        onPopoverOpenChange,
        onSave
    }: Omit<IFilterSaveConfig, "savedFiltersText" | "onSavedFiltersClick">) => (
        <>
            <Button
                {...saveButtonProps}
                className="filter__save"
                appearance="secondary"
                disabled={buttonDisabled}
                loading={buttonLoading}
                onClick={() => onPopoverOpenChange(!popoverOpen)}
            >
                {buttonText}
            </Button>
            <Popover
                open={popoverOpen}
                position={document.dir === "rtl" ? "top-right" : "top-left"}
                withArrow={false}
                setProps={setSaveButtonProps}
                onClose={() => onPopoverOpenChange(false)}
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
                        disabled={popoverSaveLoading}
                        onChange={(event) => setSaveName(event.target.value)}
                    />
                </PopoverBody>
                <PopoverFooter
                    actions={[
                        {
                            id: "filter-save-cancel",
                            text: popoverCancelText,
                            appearance: "secondary",
                            disabled: popoverSaveLoading,
                            onClick: () => onPopoverOpenChange(false)
                        },
                        {
                            id: "filter-save-submit",
                            text: popoverSaveText,
                            disabled: !saveName,
                            loading: popoverSaveLoading,
                            onClick: () => {
                                if (!popoverSaveLoading) onSave(saveName);
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
            shouldCloseOnEscapePress={!isSavePopoverOpen}
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
            headerSwappable={saveConfig && renderSavedFiltersButton(saveConfig)}
            footerSwappable={saveConfig && renderSaveSection(saveConfig)}
        >
            {children}
        </Drawer>
    );
};

export { IFilterProps, IFilterSaveConfig, Filter as default };
