import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";

import { CheckMark, IconProps, LinkX, OpenInNew } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { Popover, PopoverBody } from "@components/atoms/Popover";
import TextField from "@components/molecules/TextField";
import ToolbarButton from "@components/organisms/Editor/Toolbar/ToolbarButton/ToolbarButton";

// Constants
import { POPOVER_GAP_FROM_TARGET } from "../constants";
// Helpers
import { toHref } from "../helper";

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
    value,
    selected,
    disabled,
    onChange,
    onRemove,
    className
}) => {
    const [triggerProps, setTriggerProps] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState("");

    const href = draft.trim();

    const handleTriggerClick = (): void => {
        if (!isOpen) {
            setDraft(value ?? "");
        }

        setIsOpen((previous) => !previous);
    };

    const handleClose = (): void => {
        setIsOpen(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setDraft(event.target.value);
    };

    const handleApply = (): void => {
        if (href) {
            onChange(toHref(href));
            setIsOpen(false);
        }
    };

    const handleOpen = (): void => {
        window.open(toHref(href), "_blank", "noopener,noreferrer");
    };

    const handleRemove = (): void => {
        onRemove();
        setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleApply();
        }
    };

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
                open={isOpen}
                setProps={setTriggerProps}
                onClose={handleClose}
                position="bottom-left"
                margin={POPOVER_GAP_FROM_TARGET}
                withArrow={false}
                mobileHeightMode="fit"
            >
                <PopoverBody withPadding={false} withScrollbar={false}>
                    <div className="linkTrigger">
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
                        <Button
                            Icon={CheckMark}
                            appearance="secondary"
                            layout="text"
                            size="medium"
                            aria-label="Apply link"
                            disabled={!href}
                            onClick={handleApply}
                        />
                        <Button
                            Icon={OpenInNew}
                            appearance="secondary"
                            layout="text"
                            size="medium"
                            aria-label="Open link"
                            disabled={!href}
                            onClick={handleOpen}
                        />
                        <Button
                            Icon={LinkX}
                            appearance="secondary"
                            layout="text"
                            size="medium"
                            aria-label="Remove link"
                            disabled={!selected}
                            onClick={handleRemove}
                        />
                    </div>
                </PopoverBody>
            </Popover>
        </>
    );
};

export { ILinkTriggerProps, LinkTrigger as default };
