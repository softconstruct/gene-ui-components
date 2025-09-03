import React, { FC } from "react";
import classNames from "classnames";

import Button, { IButtonProps } from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import { images } from "@components/molecules/Empty/utils";

// Styles
import "./Empty.scss";

interface IEmptyProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The title displayed in the component.
     */
    title?: string;
    /**
     * A detailed description to accompany the title.
     */
    description?: string;
    /**
     * The source URL for a custom image.
     */
    src?: string;
    /**
     * An array of action button objects to display in the `empty` component's footer.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each object conforms to the `IButtonProps` interface, allowing full customization of each button.
     * @example
     * actions={[
     * { children: 'Cancel', appearance: 'secondary', onClick: handleCancel },
     * { children: 'Reload', appearance: 'primary', onClick: handleReload }
     * ]}
     */
    actions?: IButtonProps[];
    /**
     * Determines the visual style of the `Empty component`.<br>
     * Possible values: `noData | noResult | success | warning | info | error | notFound | forbidden | serverError`
     * Default value is `noData`
     */
    appearance?:
        | "noData"
        | "noResult"
        | "success"
        | "warning"
        | "info"
        | "error"
        | "notFound"
        | "forbidden"
        | "serverError";
    /**
     * Empty component size
     * Possible values: `small | medium`
     */
    size?: "medium" | "small";
}

/**
 * The Empty component visually represents chronological events or steps in a process. It is commonly used in dashboards, order tracking, and activity feeds to display key milestones or updates in a structured manner.
 */
const Empty: FC<IEmptyProps> = ({
    className,
    title,
    description,
    src,
    actions,
    appearance = "noData",
    size = "medium"
}) => {
    const emptyBodyRenderer = () => {
        if (!title && !description) return null;

        return (
            <div className="empty__info">
                {title && (
                    <Text
                        as="p"
                        variant={
                            // eslint-disable-next-line no-nested-ternary
                            size === "medium"
                                ? "subheadingMediumSemibold"
                                : size === "small"
                                  ? "labelLargeSemibold"
                                  : undefined
                        }
                        alignment="center"
                        className="empty__title"
                    >
                        {title}
                    </Text>
                )}
                {description && (
                    <Text as="p" variant="bodyMediumMedium" alignment="center" className="empty__description">
                        {description}
                    </Text>
                )}
            </div>
        );
    };

    const emptyContentRenderer = () => {
        if (actions && actions.length > 0) {
            return (
                <div className="empty__content">
                    {emptyBodyRenderer()}
                    {actions && actions.length > 0 && (
                        <ButtonGroup size={size}>
                            {actions.map((action: IButtonProps) => {
                                const { children: buttonChildren } = action;
                                const key = `action-${buttonChildren}`;
                                return buttonChildren ? (
                                    <Button key={key} {...action}>
                                        {buttonChildren}
                                    </Button>
                                ) : null;
                            })}
                        </ButtonGroup>
                    )}
                </div>
            );
        }

        return emptyBodyRenderer();
    };

    return (
        <div className={classNames(`empty empty_size_${size}`, className)}>
            <img src={src || images[appearance]} className="empty__image" alt="empty" />
            {emptyContentRenderer()}
        </div>
    );
};

export { IEmptyProps, Empty as default };
