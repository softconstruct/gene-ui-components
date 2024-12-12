import React, { FC, JSX, useState } from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight, Dot } from "@geneui/icons";

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
    direction?: "vertical" | "horizontal";
    size?: "large" | "medium" | "small";
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
        <div className={classNames("carousel", className, direction, size)}>
            <Button Icon={ChevronLeft} appearance="secondary" onClick={onPrevClick} />
            {children[selectedIndex]}
            <Button Icon={ChevronRight} appearance="secondary" onClick={onNextClick} />
            <div>
                {Array.from(Array(count).keys()).map((index) => (
                    <Dot key={index} />
                ))}
            </div>
        </div>
    );
};

export { ICarouselProps, Carousel as default };
