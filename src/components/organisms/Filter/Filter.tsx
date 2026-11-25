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
     * Shows the loading state of the save (confirm) button in the save popover.
     * @default false
     */
    popoverSaveLoading?: boolean;
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
     * Callback fired when the save popover is confirmed. Receives the filter name as typed by the user;
     * storing the current filter values under that name is up to the consumer.
     */
    onSave: (name: string) => void;
}

interface IFilterSaveHelpers {
    /**
     * Closes the save popover.
     */
    closePopover: () => void;
    /**
     * Updates the save configuration, e.g. `update({ popoverSaveLoading: true })`.
     * The passed values stay applied over the returned configuration until they are updated again.
     */
    update: (config: Partial<IFilterSaveConfig>) => void;
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
     * Configuration for saving the filters: a plain object, or a callback that receives the `closePopover` and `update`
     * helpers and returns that object.
     * Providing it renders the Save button with its save popover, and the Saved Filters button
     * when `onSavedFiltersClick` is set; otherwise the panel has no saving.
     * With a plain object the save popover closes on save; with a callback it stays open until `closePopover` is called.
     * @example
     * saveConfig={({ closePopover, update }) => ({
     *   onSave: async (name) => {
     *     update({ popoverSaveLoading: true });
     *     await saveFilter(name);
     *     update({ popoverSaveLoading: false });
     *     closePopover();
     *   }
     * })}
     */
    saveConfig?: IFilterSaveConfig | ((helpers: IFilterSaveHelpers) => IFilterSaveConfig);
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
    const [isSavePopoverOpen, setIsSavePopoverOpen] = useState(false);
    const [saveName, setSaveName] = useState("");
    const [saveConfigUpdates, setSaveConfigUpdates] = useState<Partial<IFilterSaveConfig>>({});

    const resolvedSaveConfig =
        typeof saveConfig === "function"
            ? {
                  ...saveConfig({
                      closePopover: () => setIsSavePopoverOpen(false),
                      update: (config) => setSaveConfigUpdates((updates) => ({ ...updates, ...config }))
                  }),
                  ...saveConfigUpdates
              }
            : saveConfig;

    useEffect(() => {
        if (!open || !saveConfig) {
            setIsSavePopoverOpen(false);
            setSaveButtonProps({});
        }
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
        popoverSaveLoading,
        onSave
    }: Omit<IFilterSaveConfig, "savedFiltersText" | "onSavedFiltersClick">) => (
        <>
            <Button
                {...saveButtonProps}
                className="filter__save"
                appearance="secondary"
                disabled={buttonDisabled}
                loading={buttonLoading}
                onClick={() => setIsSavePopoverOpen(!isSavePopoverOpen)}
            >
                {buttonText}
            </Button>
            <Popover
                open={isSavePopoverOpen}
                position={document.dir === "rtl" ? "top-right" : "top-left"}
                withArrow={false}
                setProps={setSaveButtonProps}
                onClose={() => setIsSavePopoverOpen(false)}
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
                            onClick: () => setIsSavePopoverOpen(false)
                        },
                        {
                            id: "filter-save-submit",
                            text: popoverSaveText,
                            disabled: !saveName,
                            loading: popoverSaveLoading,
                            onClick: () => {
                                onSave(saveName);
                                if (typeof saveConfig !== "function") setIsSavePopoverOpen(false);
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
            headerSwappable={resolvedSaveConfig && renderSavedFiltersButton(resolvedSaveConfig)}
            footerSwappable={resolvedSaveConfig && renderSaveSection(resolvedSaveConfig)}
        >
            {children}
        </Drawer>
    );
};

export { IFilterProps, IFilterSaveConfig, IFilterSaveHelpers, Filter as default };
