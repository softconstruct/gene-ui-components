import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";

import { CheckMark, IconProps, LinkX, OpenInNew } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { Popover, PopoverBody } from "@components/atoms/Popover";
import TextField from "@components/molecules/TextField";
import ToolbarButton from "@components/organisms/Editor/Toolbar/ToolbarButton/ToolbarButton";

// Constants
import { POPOVER_GAP_FROM_TARGET } from "../constants";
// Helpers
import { isSafeHref, toHref } from "../helper";

// Styles
import "./LinkTrigger.scss";

interface ILinkTriggerProps {
    /**
     * A React Functional Component rendered as the trigger's icon.
     */
    Icon: FC<IconProps>;
    /**
     * An ARIA label for the trigger.
     */
    "aria-label": string;
    /**
     * The URL currently applied to the selection. The field opens on this value.
     */
    value?: string;
    /**
     * The open state of the URL field. The Editor controls it, so the field also opens when a
     * link in the content is clicked.
     */
    open: boolean;
    /**
     * A callback function that is called when the URL field asks to be opened or closed.
     */
    onOpenChange: (open: boolean) => void;
    /**
     * Marks the trigger as the currently applied option.
     */
    selected?: boolean;
    /**
     * Indicates whether the trigger is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * A callback function that is called with the URL to apply to the selection.
     */
    onChange: (href: string) => void;
    /**
     * A callback function that is called when the URL is removed from the selection.
     */
    onRemove: () => void;
    /**
     * Additional class for the trigger.
     */
    className?: string;
}

/**
 * A `ToolbarButton` that opens a URL field. Internal to the Editor.
 */
const LinkTrigger: FC<ILinkTriggerProps> = ({
    Icon,
    "aria-label": ariaLabel,
    value = "",
    open,
    onOpenChange,
    selected,
    disabled,
    onChange,
    onRemove,
    className
}) => {
    const [triggerProps, setTriggerProps] = useState({});
    const [draft, setDraft] = useState("");

    const href = draft.trim();
    const hasChanges = href !== value;

    useEffect(() => {
        if (open) {
            setDraft(value);
        }
    }, [open, value]);

    const handleTriggerClick = (): void => {
        onOpenChange(!open);
    };

    const handleClose = (): void => {
        onOpenChange(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setDraft(event.target.value);
    };

    const handleApply = (): void => {
        if (isSafeHref(href)) {
            onChange(toHref(href));
            onOpenChange(false);
        }
    };

    const handleOpen = (): void => {
        if (isSafeHref(href)) {
            window.open(toHref(href), "_blank", "noopener,noreferrer");
        }
    };

    const handleRemove = (): void => {
        onRemove();
        onOpenChange(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleApply();
        }
    };

    const actions = [
        {
            id: "apply",
            Icon: CheckMark,
            "aria-label": "Apply link",
            disabled: !href || !hasChanges,
            onClick: handleApply
        },
        { id: "open", Icon: OpenInNew, "aria-label": "Open link", disabled: !href, onClick: handleOpen },
        { id: "remove", Icon: LinkX, "aria-label": "Remove link", disabled: !selected, onClick: handleRemove }
    ];

    return (
        <>
            <ToolbarButton
                triggerProps={triggerProps}
                IconBefore={Icon}
                selected={selected}
                disabled={disabled}
                className={className}
                aria-label={ariaLabel}
                onClick={handleTriggerClick}
            />

            <Popover
                open={open}
                setProps={setTriggerProps}
                onClose={handleClose}
                position="bottom-left"
                margin={POPOVER_GAP_FROM_TARGET}
                withArrow={false}
                mobileHeightMode="fit"
            >
                <PopoverBody withPadding={false} withScrollbar={false} className="linkTrigger">
                    <TextField
                        className="linkTrigger__input"
                        name="editor-link"
                        size="medium"
                        placeholder="https://"
                        value={draft}
                        autoFocus
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    {actions.map(({ id, ...action }) => (
                        <Button key={id} appearance="secondary" layout="text" size="medium" {...action} />
                    ))}
                </PopoverBody>
            </Popover>
        </>
    );
};

export { ILinkTriggerProps, LinkTrigger as default };
