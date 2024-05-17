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
    KeyboardEvent
} from 'react';
import classNames from 'classnames';

// Components
import SvgSquareIcon from './DefaultSvg';

// Styles
import './Rating.scss';

const sizes = { small: 32, medium: 36, big: 42 };

export interface IRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
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
    compareElement?: boolean;
    color: string;
    bgColor: string;
    size: string;
}

const Element: FC<IElementProps> = ({ isIcon = false, Element, compareElement = false, color, bgColor, size }) => {
    const currentColor = compareElement ? color : bgColor;

    const className = classNames('rating__icon', `s-${size}`);

    const currentSizes = {
        width: sizes[size],
        height: sizes[size]
    };

    const elementProps = { fill: currentColor, ...currentSizes, style: { color: currentColor, ...currentSizes } };

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

    const [rating, setRating] = useState(value || defaultValue || 0);
    const [hoveredValue, setHoveredValue] = useState(0);
    const [regardingPosition, setRegardingPosition] = useState(0);
    const [remainingRating, setRemainingRating] = useState(0);
    const [temporaryRating, setTemporaryRating] = useState(0);
    const [disableMouseMovie, setDisableMouseMovie] = useState(false);
    const [temporaryRegardingPosition, setTemporaryRegardingPosition] = useState(0);
    const calculateRegardingPosition = (e: MouseEvent<HTMLElement>) => {
        const getClientPosition =
            e.clientX -
            (isRTLMode ? e.currentTarget.offsetLeft + e.currentTarget.clientWidth : e.currentTarget.offsetLeft);
        const getRelativeWidth = Math.abs((getClientPosition / e.currentTarget.offsetWidth) * 100);

        return halfAllow ? (getRelativeWidth <= 50 ? 50 : 100) : 100;
    };

    const handleMouseMoveForElement = (e: MouseEvent<HTMLDivElement>, currentRating: number) => {
        if (readonly) return;
        const regradingPosition = calculateRegardingPosition(e);

        setTemporaryRegardingPosition(regradingPosition);

        if (disableMouseMovie) return;
        setRegardingPosition(regradingPosition);

        setHoveredValue(currentRating);
        setRating(currentRating);
    };

    useLayoutEffect(() => {
        if (isDefaultValueExist && !isControlled) {
            const currentValue = defaultValue || 0;
            setRating(currentValue);
            setTemporaryRating(currentValue);
        }
    }, [isDefaultValueExist, defaultValue]);

    useLayoutEffect(() => {
        const ratingDecimalParts = Math.round((rating % Math.floor(rating)) * 100);

        if (ratingDecimalParts !== 0) {
            setRemainingRating(ratingDecimalParts);
        }

        if (rating < 1) {
            setRemainingRating(Math.ceil(rating * 100));
        }
    }, [rating]);

    useEffect(() => {
        if (isControlled) {
            const currentValue = value || 0;
            setRating(currentValue);
            setTemporaryRating(currentValue);
        }
    }, [value, isControlled]);

    useEffect(() => {
        setRegardingPosition(temporaryRegardingPosition);
    }, [temporaryRegardingPosition]);

    const mouseLeaveHandler = () => {
        setHoveredValue(0);
        setRegardingPosition(0);
        setDisableMouseMovie(false);
        setRating(temporaryRating);
    };

    const ratingController = (currentRating: number, state: number, blockMouseMovie = true) => {
        setHoveredValue(currentRating);
        setTemporaryRating((prev: number) => {
            if (state !== prev) return state;

            setHoveredValue(defaultValue);
            setRating(defaultValue);
            setDisableMouseMovie(blockMouseMovie);
            return defaultValue;
        });
    };

    const getRating = (e: MouseEvent<HTMLDivElement>, currentRating: number) => {
        if (readonly) return;
        setRegardingPosition(calculateRegardingPosition(e));
        const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;
        if (isControlled) {
            setHoveredValue(defaultValue);
            setDisableMouseMovie(true);
            onChange?.(state);
            return;
        }

        ratingController(currentRating, state);
    };

    const mouseEnterHandler = () => {
        setTemporaryRating(rating);
    };

    const elementsList = Math.round(count) > 0 ? new Array(count).fill(undefined) : [];

    const PrimitiveValue = (typeof character === 'string' || typeof character === 'number') && character;

    const keyDownHandler = (e: KeyboardEvent<HTMLDivElement>, currentRating: number) => {
        if (readonly) return;

        if (e.key === 'Enter') {
            const state = regardingPosition === 50 ? +`${currentRating - 1}.${regardingPosition}` : currentRating;
            if (isControlled) {
                onChange?.(state);
                return;
            }
            ratingController(currentRating + 1, state, false);
        }
    };

    const mouseLeaveHandlerForEveryElement = () => {
        setDisableMouseMovie(false);
    };

    return (
        <div
            {...restProps}
            className="rating"
            onMouseLeave={mouseLeaveHandler}
            onMouseEnter={mouseEnterHandler}
            onBlur={() => setDisableMouseMovie(false)}
        >
            {elementsList.map((_, i) => {
                const currentRating = i + 1;
                const Icon =
                    typeof character === 'function' &&
                    isValidElement(character(i)) &&
                    (character(i) as JSX.Element).type
                        ? (character(i) as JSX.Element)
                        : null;

                const calculateWidth =
                    currentRating < hoveredValue
                        ? 100
                        : hoveredValue === currentRating
                        ? regardingPosition
                        : currentRating <= rating
                        ? 100
                        : currentRating === Math.ceil(rating)
                        ? remainingRating
                        : 0;

                const clipPath = isRTLMode
                    ? `polygon(${100 - calculateWidth}% 0, 100% 0, 100% 100%, ${100 - calculateWidth}% 100%)`
                    : `polygon( 0  0, ${calculateWidth}% 0,  ${calculateWidth}% 100%,0  100%)`;

                return (
                    <div
                        className={classNames('rating__wrapper', `s-${size}`, { 'rating__wrapper-readonly': readonly })}
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
                );
            })}
        </div>
    );
};

export default Rating;
