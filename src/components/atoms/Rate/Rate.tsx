import React, { FC, MouseEvent, useLayoutEffect, useMemo, useState } from "react";

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
                <div className={`rate__item rate__item_size_${size}`}>
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
                            <div className={`rate__item rate__item_size_${size}`} key={i}>
                                <button
                                    type="button"
                                    aria-label="rate"
                                    className="rate__heart rate__heart_color_orange rate__star_filled"
                                    onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                                    onMouseLeave={mouseLeaveHandler}
                                    onMouseEnter={mouseEnterHandler}
                                    onBlur={() => setDisableMouseMove(false)}
                                    onClick={(e) => getRating(e, currentRating)}
                                >
                                    <svg
                                        className="rate__svg"
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className="rate__heartPath2"
                                            d="M12.8199 5.57961L11.9991 6.40211L11.1759 5.57886C9.07681 3.4798 5.67355 3.4798 3.57448 5.57886C1.47542 7.67793 1.47542 11.0812 3.57448 13.1803L11.4699 21.0756C11.7627 21.3685 12.2376 21.3685 12.5305 21.0756L20.432 13.1788C22.5264 11.0728 22.53 7.67906 20.4305 5.57961C18.3276 3.47672 14.9227 3.47672 12.8199 5.57961ZM19.3684 12.1211L12.0002 19.4846L4.63514 12.1196C3.12186 10.6063 3.12186 8.15281 4.63514 6.63952C6.14843 5.12624 8.60194 5.12624 10.1152 6.63952L11.4727 7.99697C11.7705 8.29483 12.2552 8.28903 12.5459 7.98412L13.8805 6.64027C15.3976 5.12317 17.8528 5.12316 19.3699 6.64027C20.8835 8.15391 20.8809 10.6001 19.3684 12.1211Z"
                                        />
                                    </svg>

                                    <svg
                                        className="rate__svg"
                                        version="1.1"
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 24 24"
                                        style={{ clipPath }}
                                    >
                                        <path
                                            className="rate__heartPath1"
                                            d="M12.8199 5.57961L11.9991 6.40211L11.1759 5.57886C9.07681 3.4798 5.67355 3.4798 3.57448 5.57886C1.47542 7.67793 1.47542 11.0812 3.57448 13.1803L11.4699 21.0756C11.7627 21.3685 12.2376 21.3685 12.5305 21.0756L20.432 13.1788C22.5264 11.0728 22.53 7.67906 20.4305 5.57961C18.3276 3.47672 14.9227 3.47672 12.8199 5.57961Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <HelperText text="Helper text" size={size} />
        </div>
    );
};

export { IRateProps, Rate as default };
