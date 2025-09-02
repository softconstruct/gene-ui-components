import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";

import Button, { IButtonProps } from "@components/atoms/Button";
import Skeleton from "@components/atoms/Skeleton";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";

// Styles
import "./Empty.scss";

interface IEmptyProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;

    /**
     * The primary message displayed in the component.
     */
    message: string;
    /**
     * A detailed description to accompany the main message.
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
     * When set to `true`, the component will display a skeleton instead of its content.
     */
    loading?: boolean;
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
    message,
    description,
    src,
    actions,
    loading,
    appearance = "noData",
    size = "medium"
}) => {
    const [image, setImage] = useState<string>();

    useEffect(() => {
        if (src) {
            setImage(src);
            return;
        }

        import(`./../../../assets/images/${appearance}.svg`)
            .then((img) => {
                setImage(img.default);
            })
            .catch((err) => {
                console.error("Failed to load image:", err);
            });
    }, [appearance, src]);

    return (
        <div className={classNames(`empty empty_size_${size}`, className)}>
            {loading ? (
                <div className="empty__skeleton">
                    <Skeleton height={140} width={210} />
                    <div className="empty__skeletonContent">
                        <Skeleton height={20} rounded="rounded4X" />
                        <Skeleton height={20} rounded="rounded4X" />
                    </div>
                </div>
            ) : (
                <>
                    <img src={image} className="empty__image" alt="empty" />
                    <div className="empty__content">
                        <div className="empty__info">
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
                                {message}
                            </Text>
                            {description && (
                                <Text
                                    as="p"
                                    variant="bodyMediumMedium"
                                    alignment="center"
                                    className="empty__description"
                                >
                                    {description}
                                </Text>
                            )}
                        </div>
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
                </>
            )}
        </div>
    );
};

export { IEmptyProps, Empty as default };
