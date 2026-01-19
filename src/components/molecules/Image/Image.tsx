import React, { FC, MouseEvent } from "react";
import classNames from "classnames";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ImageIcon } from "lucide-react";

import { Eye, IconProps } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./Image.scss";

type ImageAspectRatio = "1:1" | "3:2" | "2:1" | "16:9";

interface IImageAction {
    /**
     * Unique identifier for the action item, forwarded to the callback.
     */
    id: number | string;
    /**
     * Text label for the action, used for tooltips or overflow menus.
     */
    label?: string;
    /**
     * The icon component to display for this action.
     */
    Icon?: FC<IconProps>;
    /**
     * Callback triggered when the action item is clicked.
     */
    onActionItemClick: (event: React.MouseEvent<HTMLButtonElement>, actionId: number | string) => void;
}

interface IImageProps {
    /**
     * Additional CSS classes for the root element.
     * Use this for positioning relative to the parent component.
     */
    className?: string;
    /**
     * Indicates whether the image resource is currently loading.
     */
    loading?: boolean;
    /**
     * Text displayed alongside the loader.
     */
    loadingText?: string;
    /**
     * The primary title text for the image card.
     */
    title?: string;
    /**
     * A brief description or subtitle for the image.
     */
    description?: string;
    /**
     * List of action items (buttons) available in the footer.
     */
    actions?: IImageAction[];
    /**
     * Indicates whether the image card is currently selected.
     */
    selected?: boolean;
    /**
     * Callback triggered when the selection checkbox is toggled.
     */
    onSelectionChange?: () => void;
    /**
     * Callback triggered when the image body is clicked.
     */
    // onImageClick?: () => void;
    /**
     * Defines the aspect ratio of the image container.
     */
    aspectRatio?: ImageAspectRatio;
    /**
     * The source URL of the image to display.
     */
    src: string;
    /**
     * Indicates if the component is in an error state (e.g., image failed to load).
     */
    error?: boolean;
}

/**
 * The Image component displays visual content with support for loading states,
 * error handling, selection, and footer actions.
 */
const Image: FC<IImageProps> = ({
    className,
    src = "https://picsum.photos/id/237/500/500",
    title,
    description,
    loading = false,
    loadingText = "Loading",
    error = false,
    aspectRatio = "1:1",
    actions = [],
    selected = false,
    onSelectionChange
    // onImageClick,
}) => {
    const hasActions = actions && actions.length > 0;
    const aspectRatioClassName = `image_size_${aspectRatio.replace(":", "x")}`;

    return (
        <article className={classNames(`image ${aspectRatioClassName}`, className)}>
            <div
                className="image__body"
                // onClick={onImageClick}
            >
                <button
                    type="button"
                    className={classNames("image__preview", {
                        image_failed: error
                    })}
                >
                    {!loading && !error && <img className="image__img" src={src} alt={title || ""} />}

                    <span className="image__content">
                        {!loading && !error && <Eye className="image__overlay" size={20} />}
                        {loading && (
                            <Loader className="image__loader" size="large" text={loadingText} textPosition="below" />
                        )}
                        {error && <ImageIcon className="image__error" size={24} />}
                    </span>
                </button>

                {onSelectionChange && !loading && (
                    <Checkbox checked={selected} onChange={onSelectionChange} className="image__checkbox" />
                )}
            </div>

            <div className="image__footer">
                <div className="image__info">
                    {title && (
                        <Text as="h3" variant="labelMediumSemibold">
                            {title}
                        </Text>
                    )}
                    {description && (
                        <Text as="p" variant="bodyMediumRegular">
                            {description}
                        </Text>
                    )}
                </div>

                {hasActions && (
                    <ButtonGroup className="image__actions" size="small">
                        {actions.map(({ Icon, id, onActionItemClick }) => (
                            <Button
                                key={id}
                                onClick={(event: MouseEvent<HTMLButtonElement>) => onActionItemClick(event, id)}
                                appearance="secondary"
                                layout="text"
                                Icon={Icon}
                                disabled={loading}
                            />
                        ))}
                    </ButtonGroup>
                )}
            </div>
        </article>
    );
};

export { IImageProps, Image as default };
