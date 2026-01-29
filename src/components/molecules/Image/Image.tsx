import React, {
    ButtonHTMLAttributes,
    ChangeEvent,
    ElementType,
    FC,
    KeyboardEvent,
    MouseEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import classNames from "classnames";

import { IconProps, Image as ImageIcon } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import Text from "@components/atoms/Text";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

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
    onActionItemClick: (actionProps: IImageAction, event: MouseEvent<HTMLButtonElement>) => void;
}

interface IImageProps {
    /**
     * Unique identifier for the image component.
     */
    id?: string | null;
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
    onCheckboxChange?: (id: string | null, e: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Callback triggered when the image body is clicked.
     */
    onImageClick?: (
        id: string | null,
        e: MouseEvent<HTMLElement, globalThis.MouseEvent> | KeyboardEvent<HTMLElement>
    ) => void;
    /**
     * Defines the aspect ratio of the image container. <br/>
     * Possible values: `1:1 | 3:2 | 2:1 | 16:9`
     */
    aspectRatio?: ImageAspectRatio;
    /**
     * The source URL of the image to display.
     */
    src?: string;
    /**
     * Indicates if the component is in a failed state (e.g., image failed to load for preview).
     */
    failed?: boolean;
    /**
     * Callback triggered when the image fails to load.
     */
    onFailed?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const aspectRatioClassNamePrefix = "image_size_";
const imageAspectRatios = {
    "1:1": `${aspectRatioClassNamePrefix}1x1`,
    "3:2": `${aspectRatioClassNamePrefix}3x2`,
    "2:1": `${aspectRatioClassNamePrefix}2x1`,
    "16:9": `${aspectRatioClassNamePrefix}16x9`
};

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
    failed = false,
    aspectRatio = "16:9",
    actions = [],
    selected = false,
    onCheckboxChange,
    onImageClick,
    onFailed
}) => {
    const [imageLoadFailed, setImageLoadFailed] = useState(failed);
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const descriptionRef = useRef<HTMLSpanElement | null>(null);
    const isTitleTruncated = useEllipsisDetection(titleRef);
    const isDescriptionTruncated = useEllipsisDetection(descriptionRef);

    const hasActions = actions && actions.length > 0;
    const aspectRatioClassName = imageAspectRatios[aspectRatio];
    const rootClassName = classNames(
        "image",
        aspectRatioClassName,
        {
            image_failed: imageLoadFailed,
            image_loading: loading
        },
        className
    );

    const isNotInteractive = loading || imageLoadFailed;

    const ImagePreview: ElementType = isNotInteractive ? "div" : "button";

    useEffect(() => {
        if (!src) {
            setImageLoadFailed(true);
        } else setImageLoadFailed(failed);
    }, [src, failed]);

    const onImageLoadError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        onFailed?.(e);
        setImageLoadFailed(true);
    };

    const imagePreviewProps = isNotInteractive
        ? {}
        : {
              type: "button" as ButtonHTMLAttributes<HTMLButtonElement>["type"],
              onClick: (e: MouseEvent<HTMLElement>) => onImageClick?.(id, e)
          };

    return (
        <article className={rootClassName}>
            <div className="image__body">
                <ImagePreview
                    {...imagePreviewProps}
                    className={classNames("image__preview", {
                        image_failed: imageLoadFailed
                    })}
                >
                    {!loading && !imageLoadFailed && (
                        <img
                            className="image__img"
                            onError={onImageLoadError}
                            src={src}
                            alt={title || ""}
                            loading="lazy"
                            decoding="async"
                        />
                    )}

                    <span className="image__content">
                        {loading && (
                            <Loader className="image__loader" size="small" textPosition="below" appearance="neutral" />
                        )}
                        {imageLoadFailed && !loading && <ImageIcon className="image__failed" size={24} />}
                    </span>
                </ImagePreview>

                {onCheckboxChange && !loading && (
                    <Checkbox
                        className="image__checkbox"
                        checked={selected}
                        onChange={(e) => onCheckboxChange(id, e)}
                    />
                )}
            </div>

            <div className="image__footer">
                <div className="image__info">
                    {title && (
                        <Tooltip text={title} isVisible={isTitleTruncated}>
                            <Text
                                ref={titleRef}
                                as="h3"
                                variant="labelMediumSemibold"
                                className="image__title ellipsis-text"
                            >
                                {title}
                            </Text>
                        </Tooltip>
                    )}
                    {description && (
                        <Tooltip text={description} isVisible={isDescriptionTruncated}>
                            <Text
                                ref={descriptionRef}
                                as="p"
                                variant="bodyMediumRegular"
                                className="image__description ellipsis-text"
                            >
                                {description}
                            </Text>
                        </Tooltip>
                    )}
                </div>

                {hasActions && (
                    <ButtonGroup iconOnly className="image__actions" size="small">
                        {actions.map((props) => {
                            const { Icon, id: actionId, label, onActionItemClick } = props;
                            return (
                                <Button
                                    key={actionId}
                                    onClick={(event: MouseEvent<HTMLButtonElement>) => onActionItemClick(props, event)}
                                    appearance="secondary"
                                    layout="text"
                                    Icon={Icon}
                                    disabled={loading}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                )}
            </div>
        </article>
    );
};

export { IImageProps, Image as default };
