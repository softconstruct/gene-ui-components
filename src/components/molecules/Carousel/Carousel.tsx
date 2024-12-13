import React, { FC, JSX, useState } from "react";
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
    direction?: "horizontal" | "vertical";
    size?: "large" | "small";
    children?: JSX.Element[];
    // fill Carousel component props interface
}

/**
 * The Carousel component is ideal for displaying multiple content items, such as images, product highlights, or customer testimonials, in a limited space. By using navigation arrows, pagination dots, or autoplay, users can engage with content sequentially and interactively.
 */
const Carousel: FC<ICarouselProps> = ({ className, children = [], direction = "horizontal", size = "large" }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const count = children.length;

    const onPrevClick = () => setSelectedIndex((prev) => (prev === 0 ? 0 : prev - 1));
    const onNextClick = () =>
        setSelectedIndex((prev) => (prev === children.length - 1 ? children.length - 1 : prev + 1));

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
                {Array.from(Array(count).keys()).map((index) => (
                    // todo: add 'carousel__dot_small' for small dots
                    <span
                        key={index}
                        className={`carousel__dot ${index === selectedIndex ? "carousel__dot_active" : ""}`}
                    />
                ))}
            </div>
        </div>
    );
};

export { ICarouselProps, Carousel as default };
