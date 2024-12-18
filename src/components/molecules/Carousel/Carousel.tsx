import React, { FC, JSX, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Styles
import "./Carousel.scss";

// Components
import Button from "../../atoms/Button";

interface ICarouselProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Dots and arrow buttons direction <br/>
     * Possible values: `horizontal | vertical`
     */
    direction?: "horizontal" | "vertical";
    /**
     * Carousel size
     * Possible values: `large | small`
     */
    size?: "large" | "small";
    /**
     * Content elements
     */
    children?: JSX.Element[];
}

const DOTS_LIMIT = 6;

/**
 * The Carousel component is ideal for displaying multiple content items, such as images, product highlights, or customer testimonials, in a limited space. By using navigation arrows, pagination dots, or autoplay, users can engage with content sequentially and interactively.
 */
const Carousel: FC<ICarouselProps> = ({ className, children = [], direction = "horizontal", size = "large" }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dotsRange, setDotsRange] = useState([0, DOTS_LIMIT]);
    const count = children.length;

    const onPrevClick = () => setSelectedIndex((prev) => (prev === 0 ? 0 : prev - 1));
    const onNextClick = () =>
        setSelectedIndex((prev) => (prev === children.length - 1 ? children.length - 1 : prev + 1));

    useLayoutEffect(
        () =>
            setDotsRange(([min, max]) => {
                let newMin = min;
                let newMax = max;

                if (selectedIndex === 0) {
                    return [0, DOTS_LIMIT];
                }

                if (selectedIndex >= max - 1 && max !== count) {
                    newMax++;
                    newMin++;
                }

                if (selectedIndex <= min && min !== 0) {
                    newMax--;
                    newMin--;
                }

                return [newMin, newMax];
            }),
        [selectedIndex, count]
    );

    return (
        <div className={classNames(`carousel carousel_${size} carousel_${direction}`, className)}>
            <Button
                className="carousel__button carousel__button_back"
                Icon={ChevronLeft}
                appearance="secondary"
                onClick={onPrevClick}
            />
            {children[selectedIndex]}
            <Button
                className="carousel__button carousel__button_forward"
                Icon={ChevronRight}
                appearance="secondary"
                onClick={onNextClick}
            />
            <div className="carousel__dots">
                {Array.from(Array(count).keys())
                    .slice(...dotsRange)
                    .map((index) => (
                        <button
                            type="button"
                            aria-labelledby="dot-selector"
                            onClick={() => setSelectedIndex(index)}
                            key={index}
                            className={classNames(
                                `carousel__dot ${index === selectedIndex ? "carousel__dot_active" : ""}`,
                                {
                                    carousel__dot_small:
                                        count > 4 && (index < selectedIndex - 1 || index > selectedIndex + 1)
                                }
                            )}
                        />
                    ))}
            </div>
        </div>
    );
};

export { ICarouselProps, Carousel as default };
