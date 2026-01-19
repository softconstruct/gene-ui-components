import React, { ChangeEvent, FC, KeyboardEvent, MouseEvent, useRef } from "react";
import classNames from "classnames";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ImageIcon } from "lucide-react";

import { Eye, IconProps } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";

import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Image.scss";

import Tooltip from "../Tooltip";

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
     * Unique identifier for the image component.
     */
    id?: string;
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
    onSelectionChange?: (e: ChangeEvent<HTMLInputElement>, id: string | null) => void;
    /**
     * Callback triggered when the image body is clicked.
     */
    onImageClick?: (
        e: React.MouseEvent<HTMLElement, globalThis.MouseEvent> | React.KeyboardEvent<HTMLElement>,
        id: string | null
    ) => void;
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
    id = null,
    className,
    src,
    title,
    description,
    loading = false,
    loadingText = "Loading",
    error = false,
    aspectRatio = "1:1",
    actions = [],
    selected = false,
    onSelectionChange,
    onImageClick
}) => {
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const descriptionRef = useRef<HTMLSpanElement | null>(null);
    const isTitleTruncated = useEllipsisDetection(titleRef, [title]);
    const isDescriptionTruncated = useEllipsisDetection(descriptionRef, [description]);

    const hasActions = actions && actions.length > 0;
    const aspectRatioClassName = `image_size_${aspectRatio.replace(":", "x")}`;

    return (
        <article className={classNames(`image ${aspectRatioClassName}`, className)}>
            <div
                role="button"
                tabIndex={0}
                className="image__body"
                onClick={(e) => onImageClick?.(e, id)}
                onKeyDown={(e) => onImageClick?.(e, id)}
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
                        {error && !loading && <ImageIcon className="image__error" size={24} />}
                    </span>
                </button>

                {onSelectionChange && !loading && (
                    <div
                        className="image__checkbox"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Checkbox checked={selected} onChange={(e) => onSelectionChange(e, id)} />
                    </div>
                )}
            </div>

            <div className="image__footer">
                <div className="image__info">
                    {title && (
                        <Tooltip text={title} isVisible={isTitleTruncated}>
                            <Text ref={titleRef} as="h3" variant="labelMediumSemibold" className="ellipsis-text">
                                {title}
                            </Text>
                        </Tooltip>
                    )}
                    {description && (
                        <Tooltip text={description} isVisible={isDescriptionTruncated}>
                            <Text ref={descriptionRef} as="p" variant="bodyMediumRegular" className="ellipsis-text">
                                {description}
                            </Text>
                        </Tooltip>
                    )}
                </div>

                {hasActions && (
                    <ButtonGroup iconOnly className="image__actions" size="small">
                        {actions.map(({ Icon, id: actionId, label, onActionItemClick }) => (
                            <Button
                                key={actionId}
                                onClick={(event: MouseEvent<HTMLButtonElement>) => onActionItemClick(event, actionId)}
                                appearance="secondary"
                                layout="text"
                                Icon={Icon}
                                disabled={loading}
                            >
                                {label}
                            </Button>
                        ))}
                    </ButtonGroup>
                )}
            </div>
        </article>
    );
};

export { IImageProps, Image as default };
