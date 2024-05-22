import React, {
    FC,
    MouseEvent,
    ReactNode,
    cloneElement,
    isValidElement,
    useLayoutEffect,
    useState,
    JSX,
    KeyboardEvent
} from 'react';
import classNames from 'classnames';

// Components
import SvgSquareIcon from './DefaultSvg';

// Styles
import './Rating.scss';

const sizes = { small: 32, medium: 36, big: 42 };

export interface IRatingProps {
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
     */
    count?: number;

    /**
     * The icon or character used to represent each rating element.<br>
     * It can be a `React functional component`, `string`, `number`, or a `function` that returns a React node.<br>
     * Possible values: `FC | string | number | ((i: number) => ReactNode)`
     */
    character?: FC | string | number | ((i: number) => ReactNode);

    /**
     * The color is used for the rating elements when hovered over or selected.
     */
    color?: string;

    /**
     * The background color of the rating elements.
     */
    bgColor?: string;

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
    size?: 'small' | 'medium' | 'big';

    /**
     * Callback function that is called when the rating value changes.<br>
     * Receives the new rating value as an argument.
     */
    onChange?: (rating: number) => void;
}

interface IElementProps {
    isIcon?: boolean;
    Element: JSX.Element | string | number;
    isCompareElement?: boolean;
    color: string;
    bgColor: string;
    size: string;
}

const Element: FC<IElementProps> = ({ isIcon = false, Element, isCompareElement = false, color, bgColor, size }) => {
    const currentColor = isCompareElement ? color : bgColor;

    const className = `rating__icon rating__icon-${size}`;

    const currentSizes = {
        width: sizes[size],
        height: sizes[size]
    };

    const elementProps = {
        fill: currentColor,
        ...currentSizes,
        style: { color: currentColor, ...currentSizes }
    };

    return isIcon ? (
        cloneElement(Element as JSX.Element, {
            ...elementProps,
            className
        })
    ) : (
        <div {...elementProps} className={className}>
            {Element}
        </div>
    );
};

const calculatePosition = (position: number) => (position - Math.floor(position)) * 100;

const Rating: FC<IRatingProps> = (props) => {
    const {
        defaultValue = 0,
        count = 5,
        onChange,
        character = SvgSquareIcon,
        color = 'var(--hero)',
        bgColor = 'rgba(var(--hero-rgb), 0.3)',
        halfAllow = false,
        readonly = false,
        size = 'small',
        value,
        ...restProps
    } = props;

    const isControlled = 'value' in props;
    const isDefaultValueExist = 'defaultValue' in props;

    const isRTLMode = document.dir === 'rtl';
    const currentValue = value || defaultValue || 0;

    const [rating, setRating] = useState(currentValue);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState(0);
    const [remainingRating, setRemainingRating] = useState(0);
    const [temporaryRating, setTemporaryRating] = useState(0);
    const [disableMouseMove, setDisableMouseMove] = useState(false);

    const calculateRegardingPosition = (e: MouseEvent<HTMLElement>) => {
        const getClientPosition =
            e.clientX -
            (isRTLMode ? e.currentTarget.offsetLeft + e.currentTarget.clientWidth : e.currentTarget.offsetLeft);
        const getRelativeWidth = Math.abs((getClientPosition / e.currentTarget.offsetWidth) * 100);

        return halfAllow && getRelativeWidth <= 50 ? 50 : 100;
    };
    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, currentRating: number) => {
        if (readonly) return;
        const regradingPosition = calculateRegardingPosition(e);
        setRegardingPosition(regradingPosition);
        if (disableMouseMove) return;
        setHoveredValue(currentRating);
        setRating(currentRating);
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

    const mouseLeaveHandler = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setDisableMouseMove(false);
        setRating(temporaryRating);
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

    const getRating = (e: MouseEvent<HTMLDivElement>, currentRating: number) => {
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

    const mouseEnterHandler = () => {
        setTemporaryRating(rating);
    };

    const elementsList = Math.round(count) > 0 ? new Array(Math.round(count)).fill(undefined) : [];

    const PrimitiveValue = (typeof character === 'string' || typeof character === 'number') && character;

    const keyDownHandler = (e: KeyboardEvent<HTMLDivElement>, currentRating: number) => {
        if (readonly) return;

        if (e.key === 'Enter') {
            if (isControlled) {
                setRegardingPosition(100);
                onChange?.(currentRating);

                return;
            }

            setRegardingPosition(0);
            ratingController(currentRating + 1, currentRating, false);
        }
    };

    const mouseLeaveHandlerForEveryElement = () => {
        setDisableMouseMove(false);
    };

    return (
        <div
            {...restProps}
            className="rating"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onBlur={() => setDisableMouseMove(false)}
        >
            {elementsList.map((_, i) => {
                const currentRating = i + 1;
                const Icon =
                    typeof character === 'function' &&
                    isValidElement(character(i)) &&
                    (character(i) as JSX.Element).type
                        ? (character(i) as JSX.Element)
                        : null;

                let calculatedWidthFor = 0;

                if (currentRating < hoveredValue) {
                    calculatedWidthFor = 100;
                } else if (hoveredValue === currentRating) {
                    calculatedWidthFor = regardingPosition;
                } else if (currentRating <= rating) {
                    calculatedWidthFor = 100;
                } else if (currentRating === Math.ceil(rating)) {
                    calculatedWidthFor = remainingRating;
                } else {
                    calculatedWidthFor = 0;
                }

                const clipPath = isRTLMode
                    ? `polygon(${100 - calculatedWidthFor}% 0, 100% 0, 100% 100%, ${100 - calculatedWidthFor}% 100%)`
                    : `polygon( 0  0, ${calculatedWidthFor}% 0,  ${calculatedWidthFor}% 100%,0  100%)`;
                return (
                    <div
                        className={classNames('rating__wrapper', `rating__wrapper-${size}`, {
                            'rating__wrapper-readonly': readonly
                        })}
                        onMouseMove={(e) => handleMouseMoveForElement(e, currentRating)}
                        onMouseLeave={mouseLeaveHandlerForEveryElement}
                        onKeyDown={(e) => keyDownHandler(e, currentRating)}
                        onClick={(e) => getRating(e, currentRating)}
                        tabIndex={0}
                        key={i}
                    >
                        {Icon && <Element color={color} bgColor={bgColor} size={size} Element={Icon} isIcon />}
                        {PrimitiveValue && (
                            <Element color={color} bgColor={bgColor} size={size} Element={PrimitiveValue} />
                        )}
                        <div
                            className="rating__element"
                            style={{
                                clipPath
                            }}
                        >
                            {Icon && (
                                <Element
                                    Element={Icon}
                                    isIcon
                                    isCompareElement
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
                                    isCompareElement
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Rating;
