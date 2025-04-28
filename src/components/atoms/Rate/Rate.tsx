import React, { CSSProperties, FC, MouseEvent, ReactNode, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import {
    EmojiAngry,
    EmojiAngryFilled,
    EmojiHappy,
    EmojiHappyFilled,
    EmojiLaugh,
    EmojiLaughFilled,
    EmojiMeh,
    EmojiMehFilled,
    EmojiSad,
    EmojiSadFilled,
    Heart,
    HeartFilled,
    Star,
    StarFilled
} from "@geneui/icons";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Styles
import "./Rate.scss";

type IconTypes = "star" | "heart" | "emoji" | "number";

type IntRange = 5 | 6 | 7 | 8 | 9 | 10;

interface IRateProps {
    /**
     * The initial rating value that is selected when the component first mounts.
     * If a user interacts with the component and no `value` prop is provided (uncontrolled usage),
     * this `defaultValue` will be used for the initial rating.
     */
    defaultValue?: number;
    /**
     * Determines the visual style of the rating elements.<br>
     * Possible values: `star | heart | emoji | number`
     */
    appearance?: IconTypes;
    /**
     * The current rating value. If this prop is provided, the Rate component
     * operates in a controlled manner, and any changes to the rating must be
     * handled externally via the `onChange` prop.
     *
     * When `value` is used, the internal state related to rating management is bypassed,
     * and the component simply reflects the prop value.
     */
    value?: number;
    /**
     * The total number of rating items to display. For instance, if `count` is 5,
     * the user can choose a rating from 1 to 5 (or half steps, if `halfAllow` is enabled).
     *
     * This value must be in the range of 5 to 10 for standard icons, but defaults to 5 when using emojis.
     */
    count?: IntRange;
    /**
     * Determines if half-step ratings are allowed (e.g., 1.5, 2.5, etc.).
     * This option is only applied if the chosen `appearance` supports partial fills
     * (currently supported by "star" and "heart").
     */
    halfAllow?: boolean;
    /**
     * Makes the rating component read-only. Users can see the rating but cannot change it.
     * Typically used for display purposes or in contexts where user interaction is not permitted.
     */
    readOnly?: boolean;
    /**
     * Specifies the overall size of each rating element.<br>
     * Possible values: `small | medium | big`
     */
    size?: "small" | "medium";
    /**
     * Callback function that is called when the rating value changes.<br>
     * Receives the new rating value as an argument.
     */
    onChange?: (rating: number) => void;
    /**
     * The text to be displayed as a label for the rating component.
     * Useful for forms or scenarios where a descriptive label is needed.
     */
    label?: string;
    /**
     * Additional descriptive text that appears alongside the `label`,
     * typically displayed as a tooltip triggered by an info icon.
     * Helps provide extra context or guidance to the user.
     */
    infoText?: string;
    /**
     * Text displayed below the rating component, commonly used for error messages,
     * hints, or validation feedback. This can guide users on how or why to use the rating field.
     */
    helperText?: string;
    /**
     * Disables the rating interaction and applies a visual style to reflect that it is not editable.
     * Unlike `readOnly`, which simply prevents interaction, `disabled` typically indicates
     * that the component is inactive due to form-level or application-level conditions.
     */
    disabled?: boolean;
}

interface CSSVariableType extends CSSProperties {
    "--rate-wrapper-width": string;
}

/** Mapping of icons used by the Rate component. */
const Icons: Record<IconTypes, object> = {
    star: {
        Filled: StarFilled,
        Default: Star
    },
    heart: {
        Filled: HeartFilled,
        Default: Heart
    },
    emoji: [
        {
            Filled: EmojiAngryFilled,
            Default: EmojiAngry
        },

        {
            Filled: EmojiSadFilled,
            Default: EmojiSad
        },

        {
            Filled: EmojiMehFilled,
            Default: EmojiMeh
        },
        {
            Filled: EmojiHappyFilled,
            Default: EmojiHappy
        },
        {
            Filled: EmojiLaughFilled,
            Default: EmojiLaugh
        }
    ],
    number: {
        Default: ({ children, className }: { className: string; children: ReactNode }) => {
            return <span className={`${className} rate__numberPath`}> {children}</span>;
        },
        Filled: ({ children, className, style }: { className: string; children: ReactNode; style: CSSProperties }) => {
            return (
                <span className={`${className} rate__number_filled rate__numberPath`} style={style}>
                    {children}
                </span>
            );
        }
    }
};

/** Determines if half-rating selection is supported for each appearance type. */
const halfAllowAccess: Record<IconTypes, boolean> = {
    star: true,
    heart: true,
    emoji: false,
    number: false
};

/** Icon width presets. */
const ICON_SIZES = {
    small: 24,
    medium: 32
};

/** Helper to calculate the percentage component of a decimal rating (e.g., 3.5 => 50%). */
const calculatePosition = (position: number) => (position - Math.floor(position)) * 100;

/*
 * Rate allows users to provide feedback by assigning a rating, typically expressed through a series of icons such as stars or numbers.
 */
const Rate: FC<IRateProps> = (props) => {
    const {
        readOnly,
        halfAllow = false,
        defaultValue,
        value,
        onChange,
        size = "small",
        count = 5,
        appearance = "star",
        label = "",
        helperText = "",
        infoText,
        disabled
    } = props;

    const isControlled = "value" in props;
    const isDefaultValueExist = "defaultValue" in props;

    const isRTLMode = document.dir === "rtl";

    const currentValue = value || defaultValue || 0;

    const [rating, setRating] = useState(currentValue);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState(0);
    const [remainingRating, setRemainingRating] = useState(0);
    const [temporaryRating, setTemporaryRating] = useState(0);
    const [disableMouseMove, setDisableMouseMove] = useState(false);

    const calculateFillPercentage = (e: MouseEvent<HTMLElement>) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const clientPosition = e.clientX - (isRTLMode ? left + width : left);

        const relativeWidth = Math.abs((clientPosition / width) * 100);

        return halfAllow && halfAllowAccess[appearance] && relativeWidth <= 50 ? 50 : 100;
    };

    const mouseEnterHandler = () => {
        if (!rating) return;
        setTemporaryRating(rating);
    };

    const ratingController = (currentRating: number, state: number, blockMouseMovie = true) => {
        setHoveredValue(currentRating);
        setRating(0);
        setRemainingRating(calculatePosition(state));
        setTemporaryRating((prev: number) => {
            if (state !== prev) return state;
            setHoveredValue(0);
            setRating(currentValue);
            setRemainingRating(calculatePosition(currentValue));
            setDisableMouseMove(blockMouseMovie);
            return currentValue;
        });
    };

    const handleMouseMoveForElement = (e: MouseEvent<HTMLButtonElement>, currentRating: number) => {
        if (readOnly || disabled) return;
        const regradingPosition = calculateFillPercentage(e);
        setRegardingPosition(regradingPosition);
        if (disableMouseMove) return;
        setHoveredValue(currentRating);
    };

    const mouseLeaveHandler = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setDisableMouseMove(false);
        setRating(temporaryRating);
    };

    const getRating = (e: MouseEvent<HTMLButtonElement>, currentRating: number) => {
        if (readOnly || disabled) return;
        setRegardingPosition(calculateFillPercentage(e));
        const selected = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

        onChange?.(selected);

        if (isControlled) {
            setDisableMouseMove(true);
            setHoveredValue(0);
            setRating(selected);
            return;
        }

        ratingController(currentRating, selected);
    };

    useEffect(() => {
        if (isControlled || isDefaultValueExist) {
            setRating(currentValue);
            setTemporaryRating(currentValue);
        }
        const ratingDecimalParts = Math.round((currentValue % Math.floor(currentValue)) * 100);

        if (ratingDecimalParts > 0) {
            setRemainingRating(ratingDecimalParts);
        }

        if (currentValue < 1) {
            setRemainingRating(Math.ceil(currentValue * 100));
        }
    }, [defaultValue, isDefaultValueExist, value, isControlled, currentValue]);

    let elementsCount = 5;
    if (appearance !== "emoji") {
        if (count && count > 10) elementsCount = 10;
        else if (count && count < 5) elementsCount = 5;
        else if (count) elementsCount = count;
    }

    const elements = useMemo(() => new Array(elementsCount).fill(null), [elementsCount]);

    const gapBetweenElements = 4;
    const contentWidth = elementsCount * (ICON_SIZES[size] + gapBetweenElements);
    const cssWitVariable: CSSVariableType = {
        "--rate-wrapper-width": `${contentWidth}px`
    };

    const iconSize = size === "medium" ? 28 : 20;

    return (
        <div
            className="rate"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onBlur={() => setDisableMouseMove(false)}
            style={cssWitVariable}
        >
            <Label labelText={label} size={size} infoText={infoText} disabled={disabled} />
            <div className="rate__content">
                <>
                    {elements.map((_, i) => {
                        const currentRating = i + 1;

                        let calculatedWidthFor = 0;

                        if (currentRating < hoveredValue) {
                            calculatedWidthFor = 100;
                        } else if (hoveredValue === currentRating) {
                            calculatedWidthFor = regardingPosition;
                        } else if (!hoveredValue && currentRating <= rating) {
                            calculatedWidthFor = 100;
                        } else if (!hoveredValue && currentRating === Math.ceil(rating)) {
                            calculatedWidthFor = remainingRating;
                        } else {
                            calculatedWidthFor = 0;
                        }

                        const clipPath = isRTLMode
                            ? `polygon(${100 - calculatedWidthFor}% 0, 100% 0, 100% 100%, ${100 - calculatedWidthFor}% 100%)`
                            : `polygon( 0  0, ${calculatedWidthFor}% 0,  ${calculatedWidthFor}% 100%,0  100%)`;

                        const { Default, Filled } = Array.isArray(Icons[appearance])
                            ? Icons[appearance][i]
                            : Icons[appearance];

                        const hoverStyle =
                            appearance === "emoji" && (hoveredValue || rating) > i ? { color: "transparent" } : {};

                        return (
                            <button
                                className={`rate__item  rate__item_size_${size}`}
                                onMouseLeave={mouseLeaveHandler}
                                onMouseEnter={mouseEnterHandler}
                                onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                                onBlur={() => setDisableMouseMove(false)}
                                onClick={(e) => getRating(e, currentRating)}
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                type="button"
                                disabled={disabled || readOnly}
                            >
                                <span
                                    aria-label="rate"
                                    className={classNames(`rate__${appearance} rate__${appearance} `, {
                                        [`rate__${appearance}_disabled`]: disabled,
                                        [`rate__${appearance}_readOnly`]: readOnly,
                                        [`rate__${appearance}_color_orange`]: (hoveredValue || rating) > i,
                                        [`rate__${appearance}_color_default`]: (hoveredValue || rating) <= i
                                    })}
                                >
                                    <Default className="rate__svg" style={hoverStyle} size={iconSize}>
                                        {i + 1}
                                    </Default>
                                    <Filled size={iconSize} style={{ clipPath }} className={`rate__svg `}>
                                        {i + 1}
                                    </Filled>
                                </span>
                            </button>
                        );
                    })}
                </>
            </div>
            <HelperText text={helperText} disabled={disabled} size={size} />
        </div>
    );
};

export { IRateProps, Rate as default };
