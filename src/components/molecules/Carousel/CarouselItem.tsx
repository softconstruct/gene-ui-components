import { FC, JSX } from "react";

export interface ICarouselItemProps {
    /**
     * Content elements
     */
    children?: JSX.Element | JSX.Element[];
}

const CarouselItem: FC<ICarouselItemProps> = ({ children }) => children;

export default CarouselItem;
