import React, {
    FC,
    HTMLAttributes,
    MouseEvent,
    ReactNode,
    cloneElement,
    isValidElement,
    useEffect,
    useLayoutEffect,
    useState,
    JSX,
    useRef
} from 'react';
import classNames from 'classnames';

// Components
import SvgStarIcon from './DefaultSvg';
// Styles
import './Rating.scss';

export interface IRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
     Default selected rating 
     */
    defaultValue?: number;

    /**
     * Selected rating
     */
    value?: number;

    /**
     Number how many elements need to be redrawn
      */
    count?: number;
    /**
     Function with which you can take a rating
     */
    onChange?: (rating: number) => void;
    /**
     Icon which we want to drawing
     */
    character?: FC | string | number | ((i: number) => ReactNode);
    /**
     * Hover and selection color
     */
    color?: string;
    /**
     * Background color
     */
    bgColor?: string;
    /**
     * Whether to allow semi selection
     */
    halfAllow?: boolean;
    /**
     * Will make switcher readonly when set to "true"
     */
    readonly?: boolean;
    /**
     * Rating size <br/>
     * Possible values: `small | medium | big`
     */
    size?: 'small' | 'medium' | 'big';
}

const sizes = { small: 36, medium: 32, big: 42 };

const Element = ({ isIcon = false, Element, compareElement = false, color, bgColor, size }) => {
    const currentColor = compareElement ? color : bgColor;

    const className = classNames('rating__icon', `s-${size}`);

    const currentSizes = {
        width: '100%',
        height: sizes[size]
    };

    const elementProps = { fill: currentColor, ...currentSizes, style: { color: currentColor, ...currentSizes } };

    return isIcon ? (
        cloneElement(Element, {
            ...elementProps,
            className
        })
    ) : (
        <div {...elementProps} className={className}>
            {Element}
        </div>
    );
};

const Rating: FC<IRatingProps> = (props) => {
    const {
        defaultValue,
        count = 5,
        onChange,
        character = SvgStarIcon,
        color = '#1267cf',
        bgColor = 'rgba(255,255,255,0.6)',
        halfAllow = true,
        readonly = false,
        size = 'small',
        value,
        ...restProps
    } = props;
    const isControlled = 'value' in props;
    const isDefaultValueExist = 'defaultValue' in props;
    const isRTLMode = document.dir === 'rtl';

    const [rating, setRating] = useState(value || defaultValue || 0);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState(0);
    const [residue, setResidue] = useState(0);
    const [temporaryRatingValue, setTemporaryRatingValue] = useState(0);
    const [iconWidth, setIconWidth] = useState(0);

    const divRef = useRef<Record<string, HTMLDivElement> | null>(null);

    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, rating: number) => {
        if (readonly) return;
        setHoveredValue(rating);
        const getClientPosition =
            e.clientX -
            (isRTLMode ? e.currentTarget.offsetLeft + e.currentTarget.clientWidth : e.currentTarget.offsetLeft);
        const getRelativeWidth = Math.abs((getClientPosition / e.currentTarget.offsetWidth) * 100);
        setRegardingPosition(halfAllow ? (getRelativeWidth <= 50 ? 50 : 100) : 100);
        setRating(0);
    };

    useLayoutEffect(() => {
        if (isDefaultValueExist && !isControlled) {
            setRating(defaultValue!);
        }
    }, [isDefaultValueExist, defaultValue]);

    useLayoutEffect(() => {
        const ratingDecimalParts = Math.round((rating % Math.floor(rating)) * 100);
        if (ratingDecimalParts !== 0) {
            setResidue(ratingDecimalParts);
        }
    }, [value, rating]);

    useEffect(() => {
        if (isControlled) {
            setRating(value!);
            setTemporaryRatingValue(value!);
        }
    }, [value]);

    useEffect(() => {
        setIconWidth(sizes[size]);
    }, [count, size]);

    const mouseLeaveHandler = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setRating(temporaryRatingValue);
    };

    const mouseLeaveHandlerForEveryElement = () => {
        setIconWidth(sizes[size]);
    };

    const ratingController = (currentRating: number, state) => {
        setIconWidth(sizes[size]);
        setHoveredValue(currentRating);

        const getCurrentRateValue = (prev: number) => {
            if (state !== prev) return state;
            setHoveredValue(0);
            setIconWidth(0);
            return 0;
        };

        setTemporaryRatingValue(getCurrentRateValue);
    };

    const getRating = (currentRating: number) => {
        if (readonly) return;

        const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

        if (isControlled) {
            onChange?.(state);
            return;
        }

        ratingController(currentRating, state);
    };

    const mouseEnterHandler = () => {
        setTemporaryRatingValue(rating);
    };

    const iconsToRender = count > 0 ? new Array(count).fill(undefined) : [];

    const PrimitiveValue = (typeof character === 'string' || typeof character === 'number') && character;

    const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>, currentRating: number) => {
        if (e.key === 'Enter') {
            const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;

            if (isControlled) {
                onChange?.(state);
                return;
            }

            setRating(state);
            ratingController(currentRating, state);
            setHoveredValue(currentRating);
            setRegardingPosition(state % 1 !== 0 ? 50 : 100);
        }
    };

    const globalKeyDawnHandler: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        e.persist();
        setRegardingPosition((prev) => {
            if (e.key === 'ArrowRight') {
                let add = prev + (halfAllow ? 50 : 100);

                setHoveredValue((prev) => {
                    const isFull = (add / 100) % 1 === 0;

                    if (isFull) {
                        divRef.current?.[`${prev + 1}`]?.focus();
                    }
                    return isFull ? prev + 1 : prev === 0 ? prev + 1 : prev;
                });
                if (add >= 100) {
                    add = 0;
                }
                setRating(0);

                return add;
            }
            if (e.key === 'ArrowLeft') {
                let reduce = prev - (halfAllow ? 50 : 100);
                setHoveredValue((prev) => {
                    const isFull = !halfAllow || !((reduce / 100) % 1 === 0);
                    if (isFull) {
                        divRef.current?.[`${prev - 1}`]?.focus();
                    }
                    return isFull ? prev - 1 : prev;
                });
                if (halfAllow && reduce < 0) {
                    return 50;
                }
                if (reduce < 0) {
                    return 0;
                }
                setRating(0);

                return reduce;
            }

            return prev;
        });
    };

    return (
        <div
            {...restProps}
            className="rating"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onKeyDown={globalKeyDawnHandler}
        >
            {iconsToRender.map((_, i) => {
                const currentRating = i + 1;
                const Icon =
                    typeof character === 'function' &&
                    isValidElement(character(i)) &&
                    (character(i) as JSX.Element).type
                        ? character(i)
                        : null;

                const calculateWidth =
                    currentRating < hoveredValue
                        ? '100%'
                        : hoveredValue === currentRating
                        ? `${regardingPosition}%`
                        : currentRating <= rating
                        ? '100%'
                        : currentRating === Math.ceil(rating)
                        ? `${residue}%`
                        : 0;

                return (
                    <div
                        className={classNames('rating__wrapper', `s-${size}`)}
                        onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                        onMouseLeave={mouseLeaveHandlerForEveryElement}
                        onKeyDown={(e) => keyDownHandler(e, currentRating)}
                        key={i}
                    >
                        <div
                            tabIndex={0}
                            className={classNames('rating__content', { 'rating__content-readonly': readonly })}
                            onClick={() => getRating(currentRating)}
                            ref={(el: HTMLDivElement) =>
                                (divRef.current = { ...divRef.current, [`${currentRating}`]: el })
                            }
                            // {...(i === hoveredValue - 1 ? { ref: divRef } : {})}
                        >
                            {Icon && <Element color={color} bgColor={bgColor} size={size} Element={Icon} isIcon />}
                            {PrimitiveValue && (
                                <Element color={color} bgColor={bgColor} size={size} Element={PrimitiveValue} />
                            )}
                            <div
                                className="rating__element"
                                style={{
                                    width: calculateWidth
                                }}
                            >
                                <div style={{ width: `${iconWidth}px`, height: '100%' }}>
                                    {Icon && (
                                        <Element
                                            Element={Icon}
                                            isIcon
                                            compareElement
                                            color={color}
                                            bgColor={bgColor}
                                            size={size}
                                        />
                                    )}
                                    {PrimitiveValue && (
                                        <Element
                                            Element={PrimitiveValue}
                                            color={color}
                                            bgColor={bgColor}
                                            size={size}
                                            compareElement
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Rating;
