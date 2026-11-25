import React, { FC, MouseEvent, RefObject, useState } from "react";

import { CheckMark, Copy as CopyIcon } from "@geneui/icons";

import Button from "@components/atoms/Button";

import Tooltip from "../../molecules/Tooltip";

interface ICopyProps {
    /**
     * Size of the copy and copied icons.
     * @default "medium"
     */
    size?: "small" | "medium" | "large" | "smallNudge";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Reference to the content you want to copy.
     */
    contentRef?: RefObject<HTMLElement>;
    /**
     * Tooltip text to display when the copy action is available. It will be shown when the user hovers over the copy icon.
     * @default "Copy"
     */
    copyTooltipText?: string;
    /**
     * Tooltip text to display when the copy action has been performed. It will be shown when the user clicks on the copy icon.
     * @default "Copied!"
     */
    copiedTooltipText?: string;
    /**
     * The value to copy. If specified, this will be copied instead of the content referenced by `contentRef`.
     */
    value?: string;
    /**
     * Indicates the action meaning. <br>
     * @default "primary"
     */
    appearance?: "secondary" | "primary" | "inverse";
    /**
     * Disables the copy, preventing it from being interacted with.
     */
    disabled?: boolean;
}

/**
 * Copy puts a value, or the text of a referenced element, on the clipboard and confirms the action in its tooltip.
 */
const Copy: FC<ICopyProps> = ({
    size = "medium",
    value,
    className,
    contentRef,
    copyTooltipText = "Copy",
    copiedTooltipText = "Copied!",
    appearance = "primary",
    disabled
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyContent = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();

        if (isCopied) return;

        const content = value || contentRef?.current?.innerText;

        if (!content) return;

        navigator.clipboard
            .writeText(content)
            .then(() => {
                setIsCopied(true);

                const id = setTimeout(() => {
                    setIsCopied(false);
                    clearTimeout(id);
                }, 2000);
            })
            .catch(() => {});
    };

    return (
        <Tooltip text={isCopied ? copiedTooltipText : copyTooltipText} isVisible>
            <Button
                className={className}
                Icon={isCopied ? CheckMark : CopyIcon}
                onClick={copyContent}
                size={size}
                disabled={disabled}
                appearance={appearance}
                layout="text"
            />
        </Tooltip>
    );
};

export { ICopyProps, Copy as default };
