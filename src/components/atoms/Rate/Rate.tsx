import React, { FC, MouseEvent, useLayoutEffect, useMemo, useState } from "react";
import { Heart, HeartFilled } from "@geneui/icons";
// Styles
import "./Rate.scss";
import { HelperText, Label } from "../../../index";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
interface IRateProps {
    /*
     * The default rating value is selected when the component is first rendered.
     */
    defaultValue?: number;

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
}

const calculatePosition = (position: number) => (position - Math.floor(position)) * 100;

const Rate: FC<IRateProps> = (props) => {
    const { readonly, halfAllow = true, defaultValue, value, onChange, size = "small", count = 5 } = props;

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

        return halfAllow && getRelativeWidth <= 50 ? 50 : 100;
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
        if (readonly) return;
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
        if (readonly) return;
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
    } else {
        elementsCount = count;
    }

    const elements = useMemo(() => new Array(elementsCount).fill(null), [count]);
    /* eslint-disable react/no-array-index-key */
    return (
        <div
            className="rate"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onBlur={() => setDisableMouseMove(false)}
        >
            <Label labelText="Label" size={size} />
            {/* STARS */}
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

                        return (
                            <button
                                className={`rate__item rate__item_size_${size}`}
                                onMouseLeave={mouseLeaveHandler}
                                onMouseEnter={mouseEnterHandler}
                                onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                                onBlur={() => setDisableMouseMove(false)}
                                onClick={(e) => getRating(e, currentRating)}
                                key={i}
                                type="button"
                            >
                                <span aria-label="rate" className="rate__heart rate__heart_color_orange">
                                    <Heart className="rate__svg" />
                                    <HeartFilled style={{ clipPath }} className="rate__svg" />
                                </span>
                            </button>
                        );
                    })}
                </>
            </div>
            <HelperText text="Helper text" size={size} />
        </div>
    );
};

export { IRateProps, Rate as default };
