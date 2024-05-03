import React, { FC, HTMLAttributes, MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LucideProps, Angry, Annoyed, Smile, Star, Laugh, Meh } from 'lucide-react';
import Tooltip from '../../molecules/Tooltip';
import './Rating.scss';
export const positions = ['top', 'right', 'bottom', 'left'] as const;

export interface IRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    defaultValue: number;
    count: number;
    onChange?: (rating: number) => void;
    Icon?: React.FC<LucideProps>;
    color?: string;
    activeColor?: string;
    showToolTip?: boolean;
    tooTipTitle?: string;
    toolTipText?: string;
    toolTipPosition?: (typeof positions)[number];
    icons?: React.FC<LucideProps>[];
}

const Rating: FC<IRatingProps> = ({
    defaultValue = 4.5,
    count = 15,
    onChange,
    Icon = Star,
    color = 'white',
    activeColor = 'red',
    icons = [Angry, Meh, Annoyed, Smile, Laugh],
    ...restProps
}) => {
    const [rating, setRating] = useState(defaultValue);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState<null | number>(null);
    const [residue, setResidue] = useState(0);
    const [temporaryRatingValue, setTemporaryRatingValue] = useState(0);
    const [iconsWidth, setIconsWidth] = useState(0);

    const iconRef = useRef<SVGSVGElement | null>(null);
    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, rating: number) => {
        setHoveredValue(rating);
        const rect = e.currentTarget.getBoundingClientRect();
        const getClientPosition = e.clientX - rect.left;
        const getRelativeWidth = Math.abs((+getClientPosition / e.currentTarget.offsetWidth) * 100);
        setRegardingPosition(getRelativeWidth <= 50 ? 50 : 100);
        setRating(0);
    };

    useLayoutEffect(() => {
        const isNumberDecimal = String(rating).split('.');
        if (isNumberDecimal.length > 1) {
            const getDecimalNumber = isNumberDecimal[1];
            setResidue(getDecimalNumber.length > 1 ? +getDecimalNumber : +`${getDecimalNumber}0`);
        }
    }, [defaultValue, rating]);

    useEffect(() => {
        if (defaultValue !== rating) {
            setRating(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        const getIconsWidth = iconRef.current?.getBoundingClientRect()?.width;
        if (getIconsWidth) {
            setIconsWidth(getIconsWidth);
        }
    }, [iconRef.current]);

    const mouseLeave = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setRating(temporaryRatingValue);
    };

    const getRating = (rating: number) => {
        const state = regardingPosition === 50 ? +`${rating - 1}.${regardingPosition}` : rating;
        if (onChange) {
            onChange(state);
        } else {
            setTemporaryRatingValue(state);
            setRating(state);
        }
    };

    const getRef = (el: SVGSVGElement) => {
        if (el) {
            iconRef.current = el;
            return;
        }
    };

    const mouseEnterHandler = () => {
        setTemporaryRatingValue(rating);
    };

    const iconsToRender = icons.length ? icons : count > 2 ? new Array(count).fill(undefined) : [];

    const generalPropsForIcons = {
        width: '100%',
        height: '100%'
    };

    return (
        <>
            <div className="rating" onMouseLeave={mouseLeave} onMouseEnter={mouseEnterHandler} {...restProps}>
                {iconsToRender.map((CurrentIcon, i) => {
                    const currentRating = i + 1;

                    const GetCurrentIcon = CurrentIcon || Icon;

                    return (
                        <>
                            <div
                                className="rating__wrapper"
                                onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                                onClick={() => getRating(currentRating)}
                                key={i}
                            >
                                <div className="rating__content">
                                    <GetCurrentIcon
                                        fill={color}
                                        ref={getRef}
                                        {...generalPropsForIcons}
                                        className="rating__icon"
                                    />
                                    <div
                                        className="rating__element"
                                        style={{
                                            width:
                                                currentRating < hoveredValue
                                                    ? '100%'
                                                    : hoveredValue === currentRating
                                                    ? `${regardingPosition}%`
                                                    : currentRating <= rating
                                                    ? '100%'
                                                    : currentRating === Math.ceil(rating)
                                                    ? `${residue}%`
                                                    : 0
                                        }}
                                    >
                                        <div style={{ width: `${iconsWidth}px`, height: '100%' }}>
                                            <GetCurrentIcon
                                                {...generalPropsForIcons}
                                                fill={activeColor}
                                                className="rating__icon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })}
            </div>
        </>
    );
};

export default Rating;
