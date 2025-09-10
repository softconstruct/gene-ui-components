import React, { FC, ReactElement, useMemo, useState } from "react";
// Utils
import classNames from "classnames";

// Icons
import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import CarouselItem from "@components/molecules/Carousel/CarouselItem";

// Hooks
import { useSwipe } from "@hooks/index";
import useDeviceInfo from "@hooks/useDeviceInfo";

// Styles
import "./Carousel.scss";

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
     * Enables the display of arrows for navigation between slides <br/>
     */
    withSlideArrows?: boolean;
    /**
     * Enables the display of indicators <br/>
     */
    withIndicators?: boolean;
    /**
     * Content elements
     */
    children?: ReactElement<typeof CarouselItem>[];
}

const DOTS_LIMIT = 6;

/**
 * The Carousel component is ideal for displaying multiple content items, such as images, product highlights, or customer testimonials, in a limited space. By using navigation arrows, pagination dots, or autoplay, users can engage with content sequentially and interactively.
 */
const Carousel: FC<ICarouselProps> = ({
    className,
    children = [],
    direction = "horizontal",
    withSlideArrows = true,
    withIndicators = true
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const count = children.length;

    const { isMobileDevice, isTouch } = useDeviceInfo();

    const onPrevClick = () => setSelectedIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
    const onNextClick = () => setSelectedIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
    const goToSlide = (index: number) => setSelectedIndex(index);

    const areArrowsVisible = withSlideArrows && !isMobileDevice && !isTouch && count > 1;

    const swipeCallbacks = useMemo(() => {
        if (direction === "horizontal") {
            return { onSlideLeft: onPrevClick, onSlideRight: onNextClick };
        }

        return { onSlideUp: onPrevClick, onSlideDown: onNextClick };
    }, [direction]);

    const ref = useSwipe<HTMLDivElement>(swipeCallbacks);
    const visibleDots = useMemo(() => {
        if (count <= DOTS_LIMIT) {
            return Array.from({ length: count }, (_, i) => ({ id: i }));
        }

        const halfLimit = Math.floor(DOTS_LIMIT / 2);
        let start = Math.max(0, selectedIndex - halfLimit);
        const end = Math.min(count, start + DOTS_LIMIT);

        if (end - start < DOTS_LIMIT) {
            start = Math.max(0, end - DOTS_LIMIT);
        }

        return Array.from({ length: end - start }, (_, i) => ({ id: start + i }));
    }, [count, selectedIndex]);

    return (
        <div className={classNames(`carousel carousel_direction_${direction}`, className)} ref={ref}>
            {areArrowsVisible && (
                <Button
                    className="carousel__button carousel__button_back"
                    Icon={ChevronLeft}
                    appearance="inverse"
                    onClick={onPrevClick}
                    ariaLabel="select-previews"
                />
            )}
            <div className="carousel__item">{children[selectedIndex]}</div>
            {areArrowsVisible && (
                <Button
                    className="carousel__button carousel__button_forward"
                    Icon={ChevronRight}
                    appearance="inverse"
                    onClick={onNextClick}
                    ariaLabel="select-next"
                />
            )}
            {withIndicators && count > 1 && (
                <div className="carousel__dots" role="tablist">
                    {visibleDots.map(({ id }) => (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-label={`select slide ${id + 1}`}
                            aria-selected={id === selectedIndex}
                            onClick={() => goToSlide(id)}
                            onTouchEnd={() => goToSlide(id)}
                            className={classNames("carousel__dot", { carousel__dot_active: id === selectedIndex })}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

Carousel.displayName = "Carousel";

export { ICarouselProps, Carousel as default };
