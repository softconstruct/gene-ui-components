import React, { FC, MouseEvent, RefObject, useState } from "react";

import { CheckMark, Copy } from "@geneui/icons";

import Button from "@components/atoms/Button";

import Tooltip from "../../molecules/Tooltip";

interface ICopyProps {
    /**
     * Size of the copy and copied icons:  `small | medium | large | smallNudge`,
     */
    size?: "small" | "medium" | "large" | "smallNudge";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Reference to the content you want to copy
     */
    contentRef?: RefObject<HTMLElement>;
    /**
     * Tooltip text to display when the copy action is available. It will be shown when the user hovers over the copy icon.
     */
    copyTooltipText?: string;
    /**
     * Tooltip text to display when the copy action has been performed. It will be shown when the user clicks on the copy icon.
     */
    copiedTooltipText?: string;
    /**
     * The value to copy. If specified, this will be copied instead of the content referenced by contentRef.
     */
    value?: string;
    /**
     * Indicates the action meaning. <br>
     * Possible values: `secondary | primary | inverse`
     */
    appearance?: "secondary" | "primary" | "inverse";
    /**
     *  Disables the copy, preventing it from being interacted with.
     */
    disabled?: boolean;
}

// Copy component used to copy content to the clipboard, providing visual feedback upon success.
const CopyComponent: FC<ICopyProps> = ({
    size = "medium",
    value,
    className,
    contentRef,
    copyTooltipText = "Copy",
    copiedTooltipText = "Copied",
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
            .catch((error) => console.error("Failed to copy:", error));
    };

    return (
        <Tooltip text={isCopied ? copiedTooltipText : copyTooltipText} isVisible>
            <Button
                className={className}
                Icon={isCopied ? CheckMark : Copy}
                onClick={copyContent}
                size={size}
                disabled={disabled}
                appearance={appearance}
                layout="text"
            />
        </Tooltip>
    );
};

export { ICopyProps, CopyComponent as default };
