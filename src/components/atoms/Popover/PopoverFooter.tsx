import React, { FC, MouseEvent, ReactNode, useMemo } from "react";
import { nanoid } from "nanoid/non-secure";

import { IconProps } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import ButtonGroup from "@components/molecules/ButtonGroup";

export interface IPopoverFooterActionProps {
    /**
     * The `Icon` component to display in the action button. If not provided, the action button will not be rendered.
     */
    Icon?: React.FC<IconProps>;
    /**
     * A callback function that is called when the button is clicked.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * HTML id attribute for the button element.
     */
    id?: string;
    /**
     * Specifies the name of the button.
     */
    name?: string;
    /**
     * An ARIA label for the button.
     */
    "aria-label"?: string;
    /**
     * The text will shown as content of the `button`.
     */
    text?: string;
    /**
     * The appearance of the button.
     */
    appearance?: "primary" | "secondary" | "danger" | "success" | "inverse";
    /**
     * Whether the button is disabled.
     */
    disabled?: boolean;
}

export interface IPopoverFooterProps {
    /**
     * The swappable content displayed in the footer.
     */
    children?: ReactNode;
    /**
     * An array of action button objects to display in the footer.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * @example
     * actions={[
     *   { Icon: Globe, text: "View", onClick: handleAction },
     *   { Icon: Download, text: "Download" },
     *   { text: "Edit" }
     * ]}
     */
    actions?: IPopoverFooterActionProps[];
}

const PopoverFooter: FC<IPopoverFooterProps> = ({ children, actions }) => {
    const hasActions = actions && actions.length > 0;

    const actionsWithIds = useMemo(() => {
        if (!actions) return [];
        return actions.map((action) => ({
            ...action,
            id: action.id || `popover-footer-action-${nanoid()}`
        }));
    }, [actions]);

    return (
        <div className="popover__footer">
            {children}
            {hasActions && (
                <ButtonGroup className="popover__footer_buttons" size="medium">
                    {actionsWithIds.map((action) => {
                        if (action.Icon || action.text) {
                            const { text: actionText, ...restAction } = action;
                            return (
                                <Button key={action.id} {...restAction}>
                                    {actionText}
                                </Button>
                            );
                        }
                        return null;
                    })}
                </ButtonGroup>
            )}
        </div>
    );
};

export default PopoverFooter;
