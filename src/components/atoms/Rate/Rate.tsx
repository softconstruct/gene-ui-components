import React, { FC, MouseEvent, useLayoutEffect, useMemo, useState } from "react";
import {
    Heart,
    HeartFilled,
    Star,
    StarFilled,
    EmojiAngryFilled,
    EmojiAngry,
    EmojiHappy,
    EmojiHappyFilled,
    EmojiLaugh,
    EmojiLaughFilled,
    EmojiMehFilled,
    EmojiMeh,
    EmojiSad,
    EmojiSadFilled
} from "@geneui/icons";
// Styles
import "./Rate.scss";
import classNames from "classnames";
import { HelperText, Label } from "../../../index";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

const Icons = {
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
    num: {
        Default: ({ children, className }) => {
            return <span className={className}> {children}</span>;
        },
        Filled: ({ children, className, style }) => {
            return (
                <span className={className} style={style}>
                    {children}
                </span>
            );
        }
    }
};

interface IRateProps {
    /*
     * The default rating value is selected when the component is first rendered.
     */
    defaultValue?: number;
    /**
     * Icon types.<br>
     * Possible values: `star | heart | emoji`
     */
    iconType: "star" | "heart" | "emoji" | "num";
    /**
     * The currently selected rating value. Use this to control the component from the outside.<br>
     * If this prop is used the component will lose default behavior related to rating state.
     */
    value?: number;
    /**
     * The number of rating elements to render.
     * Start from 5 to 10.
     */
    count?: IntRange<5, 11>;
    /**
     * Allows users to select half values in the rating component, enabling finer granularity.<br>
     * For example, if `count` is 5, users can select 1, 1.5, 2, 2.5, and so on up to 5.
     */
    halfAllow?: boolean;
    /**
     * When set to `true`, the rating component becomes read-only, preventing any interaction.
     */
    readonly?: boolean;
    /**
     * The size of the rating elements.<br>
     * Possible values: `small | medium | big`
     */
    size?: "small" | "medium";
    /**
     * Callback function that is called when the rating value changes.<br>
     * Receives the new rating value as an argument.
     */
    onChange?: (rating: number) => void;
    /**
     * Indicates whether the label represents a required field.
     * When set to `true`, a visual indicator (asterisk) will be added to denote that the field is required.
     */
    required?: boolean;
    /**
     * The text content of the `label`.
     * This is the main text displayed within the `label`.
     */
    label?: string;
    /**
     * Additional descriptive text shown with info icon and tooltip alongside of the label component.
     */
    infoText?: string /**
     * The actual text content to be displayed as helper text.
     */;
    helperText?: string;
    /**
     * Indicates whether the `label` should be displayed as `disabled`.
     * When set to `true`, the `label` will be styled to appear `disabled`, which can indicate that the associated input field is not editable.
     */
    disable?: boolean;
}

const calculatePosition = (position: number) => (position - Math.floor(position)) * 100;

const halfAllowAccess = {
    star: true,
    heart: true,
    emoji: false,
    num: false
};

const Rate: FC<IRateProps> = (props) => {
    const {
        readonly,
        halfAllow = true,
        defaultValue,
        value,
        onChange,
        size = "small",
        count = 5,
        iconType = "heart",
        label = "",
        required,
        helperText = "",
        infoText,
        disable
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

    const calculateRegardingPosition = (e: MouseEvent<HTMLElement>) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const getClientPosition = e.clientX - (isRTLMode ? left + width : left);
        const getRelativeWidth = Math.abs((getClientPosition / width) * 100);
        return halfAllow && halfAllowAccess[iconType] && getRelativeWidth <= 50 ? 50 : 100;
    };
    const mouseEnterHandler = () => {
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
        if (readonly || disable) return;
        const regradingPosition = calculateRegardingPosition(e);
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
        if (readonly || disable) return;
        setRegardingPosition(calculateRegardingPosition(e));
        const selected = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

        if (isControlled) {
            setDisableMouseMove(true);
            setHoveredValue(0);
            setRating(selected);
            onChange?.(selected);
            return;
        }

        ratingController(currentRating, selected);
    };

    useLayoutEffect(() => {
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

    let elementsCount = 0;
    if (count > 10) {
        elementsCount = 10;
    } else if (count < 5) {
        elementsCount = 5;
    } else if (iconType === "emoji") {
        elementsCount = 5;
    } else {
        elementsCount = count;
    }

    const elements = useMemo(() => new Array(elementsCount).fill(null), [count, elementsCount]);

    /* eslint-disable react/no-array-index-key */
    return (
        <div
            className="rate"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onBlur={() => setDisableMouseMove(false)}
        >
            <Label labelText={label} size={size} required={required} infoText={infoText} />
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

                        const { Default, Filled } = Array.isArray(Icons[iconType])
                            ? Icons[iconType][i]
                            : Icons[iconType];

                        const hoverStyle =
                            iconType === "emoji" && (hoveredValue || rating) > i ? { color: "transparent" } : {};

                        return (
                            <button
                                className={classNames(`rate__item  rate__item_size_${size}`, {
                                    rate__item_readOnly: readonly,
                                    [`rate__${iconType}_disabled`]: disable
                                })}
                                onMouseLeave={mouseLeaveHandler}
                                onMouseEnter={mouseEnterHandler}
                                onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                                onBlur={() => setDisableMouseMove(false)}
                                onClick={(e) => getRating(e, currentRating)}
                                key={i}
                                type="button"
                            >
                                <span
                                    aria-label="rate"
                                    className={`rate__${iconType} rate__${iconType} rate__${iconType}_color_orange`}
                                >
                                    <Default
                                        className={`rate__svg  rate_unfilled  rate__${iconType}_color_default`}
                                        style={hoverStyle}
                                    >
                                        {i + 1}
                                    </Default>
                                    <Filled
                                        style={{ clipPath }}
                                        className={`rate__svg rate__${iconType}_filled rate__${iconType}_color_orange`}
                                    >
                                        {i + 1}
                                    </Filled>
                                </span>
                            </button>
                        );
                    })}
                </>
            </div>
            <HelperText text={helperText} size={size} />
        </div>
    );
};

export { IRateProps, Rate as default };
